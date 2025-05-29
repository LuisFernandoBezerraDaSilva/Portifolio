const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const authController = require('../controllers/authController');
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/auth/register', (req, res) => userController.create(req, res));
router.post('/auth/login', (req, res) => authController.login(req, res));

router.get('/tasks', authenticateToken, (req, res) => taskController.getAll(req, res));
router.post('/tasks', authenticateToken, (req, res) => taskController.create(req, res));
router.put('/tasks/:id', authenticateToken, (req, res) => taskController.update(req, res));
router.delete('/tasks/:id', authenticateToken, (req, res) => taskController.delete(req, res));

module.exports = router;