const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  updateMemberRole,
  getProjectStats
} = require('../controllers/projectController');
const { protect, authorize, projectMember, projectRole } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const projectValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome do projeto é obrigatório')
    .isLength({ min: 3 })
    .withMessage('Nome do projeto deve ter no mínimo 3 caracteres'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Descrição do projeto é obrigatória')
    .isLength({ min: 10 })
    .withMessage('Descrição deve ter no mínimo 10 caracteres'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Data de início inválida'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Data de término inválida')
    .custom((endDate, { req }) => {
      if (req.body.startDate && endDate <= req.body.startDate) {
        throw new Error('Data de término deve ser posterior à data de início');
      }
      return true;
    }),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags devem ser um array')
];

const memberValidation = [
  body('userId')
    .trim()
    .notEmpty()
    .withMessage('ID do usuário é obrigatório')
    .isMongoId()
    .withMessage('ID do usuário inválido'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Função é obrigatória')
    .isIn(['Administrador', 'Membro', 'Visualizador'])
    .withMessage('Função inválida')
];

// Apply protection to all routes
router.use(protect);

// Project routes
router.route('/')
  .post(authorize('Administrador', 'Membro'), projectValidation, createProject)
  .get(getProjects);

router.route('/:id')
  .get(projectMember, getProject)
  .put(projectRole('Administrador'), projectValidation, updateProject)
  .delete(projectRole('Administrador'), deleteProject);

// Project member routes
router.route('/:id/members')
  .post(
    projectRole('Administrador'),
    memberValidation,
    addProjectMember
  );

router.route('/:id/members/:userId')
  .delete(projectRole('Administrador'), removeProjectMember)
  .put(
    projectRole('Administrador'),
    [
      body('role')
        .trim()
        .notEmpty()
        .withMessage('Função é obrigatória')
        .isIn(['Administrador', 'Membro', 'Visualizador'])
        .withMessage('Função inválida')
    ],
    updateMemberRole
  );

// Project statistics
router.get('/:id/stats', projectMember, getProjectStats);

// Middleware to load project for routes that need it
router.param('id', async (req, res, next, id) => {
  try {
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projeto não encontrado'
      });
    }

    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;