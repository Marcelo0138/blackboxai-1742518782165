const jwt = require('jsonwebtoken');
const { APIError } = require('./errorHandler');
const User = require('../models/User');

// Protect routes - Verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new APIError('Não autorizado - Token não encontrado', 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        throw new APIError('Usuário não encontrado', 404);
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new APIError('Token inválido', 401);
      }
      if (error.name === 'TokenExpiredError') {
        throw new APIError('Token expirado', 401);
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// Role authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new APIError(
        'Seu nível de acesso não permite realizar esta ação',
        403
      );
    }
    next();
  };
};

// Project member authorization
const projectMember = async (req, res, next) => {
  try {
    const project = await req.project;
    
    if (!project) {
      throw new APIError('Projeto não encontrado', 404);
    }

    const isMember = project.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!isMember && req.user.role !== 'Administrador') {
      throw new APIError('Acesso negado - Você não é membro deste projeto', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Project role authorization
const projectRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const project = await req.project;
      
      if (!project) {
        throw new APIError('Projeto não encontrado', 404);
      }

      const member = project.members.find(
        member => member.user.toString() === req.user._id.toString()
      );

      if (!member && req.user.role !== 'Administrador') {
        throw new APIError('Acesso negado - Você não é membro deste projeto', 403);
      }

      if (!roles.includes(member.role) && req.user.role !== 'Administrador') {
        throw new APIError(
          'Seu nível de acesso no projeto não permite realizar esta ação',
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Task assignee authorization
const taskAssignee = async (req, res, next) => {
  try {
    const task = await req.task;
    
    if (!task) {
      throw new APIError('Tarefa não encontrada', 404);
    }

    const isAssignee = task.assignedTo.some(
      userId => userId.toString() === req.user._id.toString()
    );

    if (!isAssignee && req.user.role !== 'Administrador') {
      throw new APIError('Acesso negado - Você não está atribuído a esta tarefa', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
  authorize,
  projectMember,
  projectRole,
  taskAssignee
};