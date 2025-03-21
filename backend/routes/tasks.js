const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  addComment,
  reorderTasks,
  getTaskStats
} = require('../controllers/taskController');
const { protect, projectMember, taskAssignee } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Validation middleware
const taskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Título da tarefa é obrigatório')
    .isLength({ min: 3 })
    .withMessage('Título deve ter no mínimo 3 caracteres'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Descrição da tarefa é obrigatória')
    .isLength({ min: 10 })
    .withMessage('Descrição deve ter no mínimo 10 caracteres'),
  body('priority')
    .trim()
    .notEmpty()
    .withMessage('Prioridade é obrigatória')
    .isIn(['Baixa', 'Média', 'Alta', 'Urgente'])
    .withMessage('Prioridade inválida'),
  body('status')
    .optional()
    .trim()
    .isIn(['Pendente', 'Em Andamento', 'Em Revisão', 'Concluída'])
    .withMessage('Status inválido'),
  body('deadline')
    .notEmpty()
    .withMessage('Data de entrega é obrigatória')
    .isISO8601()
    .withMessage('Data de entrega inválida'),
  body('assignedTo')
    .isArray()
    .withMessage('Responsáveis deve ser um array')
    .custom((value) => {
      if (value.length === 0) {
        throw new Error('Pelo menos um responsável deve ser atribuído');
      }
      return true;
    }),
  body('assignedTo.*')
    .isMongoId()
    .withMessage('ID de responsável inválido'),
  body('estimatedHours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Horas estimadas deve ser um número positivo'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags devem ser um array')
];

const commentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Conteúdo do comentário é obrigatório')
    .isLength({ min: 1 })
    .withMessage('Comentário não pode estar vazio'),
  body('mentions')
    .optional()
    .isArray()
    .withMessage('Menções devem ser um array'),
  body('mentions.*')
    .optional()
    .isMongoId()
    .withMessage('ID de usuário mencionado inválido')
];

const reorderValidation = [
  body('tasks')
    .isArray()
    .withMessage('Lista de tarefas deve ser um array'),
  body('tasks.*.id')
    .isMongoId()
    .withMessage('ID de tarefa inválido'),
  body('tasks.*.order')
    .isInt({ min: 0 })
    .withMessage('Ordem deve ser um número inteiro positivo')
];

// Apply protection to all routes
router.use(protect);

// Project task routes
router.route('/')
  .post(projectMember, taskValidation, createTask)
  .get(projectMember, getTasks);

// Task reordering
router.put('/reorder', projectMember, reorderValidation, reorderTasks);

// Individual task routes
router.route('/:id')
  .get(taskAssignee, getTask)
  .put(taskAssignee, taskValidation, updateTask)
  .delete(taskAssignee, deleteTask);

// Task comments
router.post('/:id/comments', taskAssignee, commentValidation, addComment);

// Task statistics
router.get('/:id/stats', taskAssignee, getTaskStats);

// Middleware to load task for routes that need it
router.param('id', async (req, res, next, id) => {
  try {
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarefa não encontrada'
      });
    }

    req.task = task;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;