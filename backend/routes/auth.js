const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  googleAuth,
  getMe,
  updateProfile,
  getNotifications,
  markNotificationAsRead
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter no mínimo 2 caracteres'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres')
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Nome não pode estar vazio')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter no mínimo 2 caracteres'),
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email não pode estar vazio')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Senha não pode estar vazia')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/google', googleAuth);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.put('/profile', updateProfileValidation, updateProfile);
router.get('/notifications', getNotifications);
router.put('/notifications/:id', markNotificationAsRead);

module.exports = router;