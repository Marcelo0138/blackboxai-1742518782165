const Project = require('../models/Project');
const Task = require('../models/Task');
const { APIError } = require('../middleware/errorHandler');
const NotificationService = require('../services/notificationService');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, tags } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      startDate,
      endDate,
      tags,
      members: [{ user: req.user._id, role: 'Administrador' }]
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects (that user is member of)
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      'members.user': req.user._id
    })
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')
    .sort('-createdAt');

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .populate({
        path: 'tasks',
        populate: [
          { path: 'assignedTo', select: 'name email avatar' },
          { path: 'createdBy', select: 'name email avatar' }
        ]
      });

    if (!project) {
      throw new APIError('Projeto não encontrado', 404);
    }

    // Check if user is member
    if (!project.isMember(req.user._id) && req.user.role !== 'Administrador') {
      throw new APIError('Não autorizado - Você não é membro deste projeto', 403);
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      throw new APIError('Projeto não encontrado', 404);
    }

    // Check if user is project admin or system admin
    if (!project.hasRole(req.user._id, 'Administrador') && req.user.role !== 'Administrador') {
      throw new APIError('Não autorizado - Apenas administradores podem atualizar o projeto', 403);
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      throw new APIError('Projeto não encontrado', 404);
    }

    // Check if user is project owner or system admin
    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'Administrador') {
      throw new APIError('Não autorizado - Apenas o proprietário pode deletar o projeto', 403);
    }

    // Delete all tasks associated with the project
    await Task.deleteMany({ project: req.params.id });

    await project.remove();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add project member
// @route   POST /api/projects/:id/members
// @access  Private
const addProjectMember = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      throw new APIError('Projeto não encontrado', 404);
    }

    // Check if user is project admin or system admin
    if (!project.hasRole(req.user._id, 'Administrador') && req.user.role !== 'Administrador') {
      throw new APIError('Não autorizado - Apenas administradores podem adicionar membros', 403);
    }

    await project.addMember(userId, role);

    const updatedProject = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    // Send notification
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.notifyProjectMemberAdded(
      project,
      await User.findById(userId),
      req.user
    );

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove project member
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
const removeProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      throw new APIError('Projeto não encontrado', 404);
    }

    // Check if user is project admin or system admin
    if (!project.hasRole(req.user._id, 'Administrador') && req.user.role !== 'Administrador') {
      throw new APIError('Não autorizado - Apenas administradores podem remover membros', 403);
    }

    await project.removeMember(req.params.userId);

    const updatedProject = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member role
// @route   PUT /api/projects/:id/members/:userId
// @access  Private
const updateMemberRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      throw new APIError('Projeto não encontrado', 404);
    }

    // Check if user is project admin or system admin
    if (!project.hasRole(req.user._id, 'Administrador') && req.user.role !== 'Administrador') {
      throw new APIError('Não autorizado - Apenas administradores podem atualizar funções', 403);
    }

    await project.updateMemberRole(req.params.userId, role);

    const updatedProject = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/:id/stats
// @access  Private
const getProjectStats = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      throw new APIError('Projeto não encontrado', 404);
    }

    const tasks = await Task.find({ project: req.params.id });

    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(task => task.status === 'Concluída').length,
      inProgressTasks: tasks.filter(task => task.status === 'Em Andamento').length,
      pendingTasks: tasks.filter(task => task.status === 'Pendente').length,
      overdueTasks: tasks.filter(task => {
        return new Date(task.deadline) < new Date() && task.status !== 'Concluída';
      }).length,
      progress: project.progress,
      memberCount: project.members.length
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
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  updateMemberRole,
  getProjectStats
};