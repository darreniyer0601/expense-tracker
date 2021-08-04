const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const isAuth = require('../middleware/isAuth');
const authController = require('../controllers/auth');

// @route   GET /api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', isAuth, authController.getUser);

// @route   POST /api/auth/login
// @desc    Login the user
// @access  Public
router.post('/login', [
    check('email', 'Please provide an email').isEmail(),
    check('password', 'Password is required').not().isEmpty()
],authController.login);

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please provide an email').isEmail(),
    check('password', 'Password is required').not().isEmpty()
], authController.register);

module.exports = router;