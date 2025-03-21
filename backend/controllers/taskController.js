const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const { APIError } = require('../middleware/errorHandler');
const NotificationService = require('../services/notificationService');

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      throw new APIError('Projeto não encontrado', 404);
    }

    const task = await Task.create({
      ...req.body,
      project: req.params.projectId,
      createdBy: req.user._id
    });

    // Add task to project
    project.tasks.push(task._id);
    await project.save();

    // Send notifications to assigned users
    const notificationService = new NotificationService(req.app.get('io'));
    for (const userId of task.assignedTo) {
      await notificationService.notifyTaskAssignment(
        task,
        await User.findById(userId)
      );
    }

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort('order');

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name email avatar'
        }
      });

    if (!task) {
      throw new APIError('Tarefa não encontrada', 404);
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      throw new APIError('Tarefa não encontrada', 404);
    }

    const previousStatus = task.status;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar');

    // If status changed, send notifications
    if (req.body.status && previousStatus !== req.body.status) {
      const notificationService = new NotificationService(req.app.get('io'));
      await notificationService.notifyTaskStatusChange(
        task,
        previousStatus,
        req.user
      );
    }

    // Update project progress
    const project = await Project.findById(task.project);
    await project.updateProgress();

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      throw new APIError('Tarefa não encontrada', 404);
    }

    // Remove task from project
    const project = await Project.findById(task.project);
    project.tasks = project.tasks.filter(
      taskId => taskId.toString() !== req.params.id
    );
    await project.save();

    // Delete all comments
    await Comment.deleteMany({ task: req.params.id });

    await task.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      throw new APIError('Tarefa não encontrada', 404);
    }

    const comment = await Comment.create({
      task: req.params.id,
      user: req.user._id,
      content: req.body.content,
      mentions: req.body.mentions
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name email avatar')
      .populate('mentions', 'name email avatar');

    // Send notifications
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.notifyTaskComment(task, comment, req.user);

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task order (for drag and drop)
// @route   PUT /api/projects/:projectId/tasks/reorder
// @access  Private
const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body;

    // Update order for each task
    await Promise.all(
      tasks.map((task, index) =>
        Task.findByIdAndUpdate(task._id, { order: index })
      )
    );

    const updatedTasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort('order');

    res.json({
      success: true,
      data: updatedTasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/:id/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      throw new APIError('Tarefa não encontrada', 404);
    }

    const stats = {
      timeTracking: task.timeTracking,
      deadlineStatus: task.deadlineStatus,
      commentsCount: task.comments.length,
      attachmentsCount: task.attachments.length,
      assigneesCount: task.assignedTo.length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  addComment,
  reorderTasks,
  getTaskStats
};