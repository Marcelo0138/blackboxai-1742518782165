const nodemailer = require('nodemailer');
const User = require('../models/User');

class NotificationService {
  constructor(io) {
    this.io = io;
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Send real-time notification via Socket.io
  async sendSocketNotification(userId, notification) {
    this.io.to(`user-${userId}`).emit('notification', notification);
  }

  // Send email notification
  async sendEmailNotification(to, subject, html) {
    try {
      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  // Add notification to user's notifications array
  async addUserNotification(userId, type, message) {
    try {
      const user = await User.findById(userId);
      if (user) {
        await user.addNotification(type, message);
      }
    } catch (error) {
      console.error('Error adding user notification:', error);
    }
  }

  // Notify task assignment
  async notifyTaskAssignment(task, assignedUser) {
    const notification = {
      type: 'TASK_ASSIGNED',
      message: `Você foi atribuído à tarefa: ${task.title}`,
      taskId: task._id,
      projectId: task.project
    };

    // Send socket notification
    await this.sendSocketNotification(assignedUser._id, notification);

    // Add to user's notifications
    await this.addUserNotification(
      assignedUser._id,
      'TASK_ASSIGNED',
      notification.message
    );

    // Send email
    const emailHtml = `
      <h2>Nova Tarefa Atribuída</h2>
      <p>Olá ${assignedUser.name},</p>
      <p>Você foi atribuído à seguinte tarefa:</p>
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <p>Prioridade: ${task.priority}</p>
      <p>Data de entrega: ${new Date(task.deadline).toLocaleDateString()}</p>
    `;

    await this.sendEmailNotification(
      assignedUser.email,
      'Nova Tarefa Atribuída',
      emailHtml
    );
  }

  // Notify task status change
  async notifyTaskStatusChange(task, previousStatus, updatedBy) {
    const notification = {
      type: 'TASK_STATUS_CHANGED',
      message: `Status da tarefa "${task.title}" alterado de ${previousStatus} para ${task.status}`,
      taskId: task._id,
      projectId: task.project
    };

    // Notify all assigned users
    for (const userId of task.assignedTo) {
      if (userId.toString() !== updatedBy._id.toString()) {
        await this.sendSocketNotification(userId, notification);
        await this.addUserNotification(
          userId,
          'TASK_STATUS_CHANGED',
          notification.message
        );
      }
    }
  }

  // Notify task comment
  async notifyTaskComment(task, comment, commentedBy) {
    const notification = {
      type: 'TASK_COMMENT',
      message: `Novo comentário na tarefa "${task.title}" por ${commentedBy.name}`,
      taskId: task._id,
      projectId: task.project,
      commentId: comment._id
    };

    // Notify all assigned users and task creator
    const notifyUsers = new Set([
      ...task.assignedTo.map(id => id.toString()),
      task.createdBy.toString()
    ]);

    // Remove the commenter from notification recipients
    notifyUsers.delete(commentedBy._id.toString());

    // Send notifications
    for (const userId of notifyUsers) {
      await this.sendSocketNotification(userId, notification);
      await this.addUserNotification(
        userId,
        'TASK_COMMENT',
        notification.message
      );
    }
  }

  // Notify task deadline approaching
  async notifyTaskDeadline(task) {
    const daysUntilDeadline = Math.ceil(
      (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)
    );

    const notification = {
      type: 'TASK_DEADLINE',
      message: `A tarefa "${task.title}" vence em ${daysUntilDeadline} dias`,
      taskId: task._id,
      projectId: task.project
    };

    // Notify all assigned users
    for (const userId of task.assignedTo) {
      await this.sendSocketNotification(userId, notification);
      await this.addUserNotification(
        userId,
        'TASK_DEADLINE',
        notification.message
      );

      // Get user for email
      const user = await User.findById(userId);
      if (user) {
        const emailHtml = `
          <h2>Lembrete de Prazo</h2>
          <p>Olá ${user.name},</p>
          <p>A seguinte tarefa vence em ${daysUntilDeadline} dias:</p>
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p>Data de entrega: ${new Date(task.deadline).toLocaleDateString()}</p>
        `;

        await this.sendEmailNotification(
          user.email,
          'Lembrete de Prazo de Tarefa',
          emailHtml
        );
      }
    }
  }

  // Notify project member added
  async notifyProjectMemberAdded(project, addedUser, addedBy) {
    const notification = {
      type: 'PROJECT_MEMBER_ADDED',
      message: `Você foi adicionado ao projeto "${project.name}" por ${addedBy.name}`,
      projectId: project._id
    };

    await this.sendSocketNotification(addedUser._id, notification);
    await this.addUserNotification(
      addedUser._id,
      'PROJECT_MEMBER_ADDED',
      notification.message
    );

    const emailHtml = `
      <h2>Adicionado a Novo Projeto</h2>
      <p>Olá ${addedUser.name},</p>
      <p>Você foi adicionado ao projeto "${project.name}" por ${addedBy.name}.</p>
      <p>Descrição do projeto: ${project.description}</p>
    `;

    await this.sendEmailNotification(
      addedUser.email,
      'Adicionado a Novo Projeto',
      emailHtml
    );
  }
}

module.exports = NotificationService;