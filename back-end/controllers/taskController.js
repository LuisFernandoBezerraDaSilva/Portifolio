const BaseController = require('./baseController');
const TaskService = require('../services/taskService');
const AuthService = require('../services/authService');

const authService = new AuthService();

class TaskController extends BaseController {
  constructor(service) {
    super(service);
  }

  async getAll(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token missing' });
      }

      const filter = req.query.filter || "";
      const status = req.query.status || "";
      const page = Number.isNaN(parseInt(req.query.page)) ? 1 : parseInt(req.query.page);
      const limit = Number.isNaN(parseInt(req.query.limit)) ? 10 : parseInt(req.query.limit);

      const result = await this.service.getAll(token, filter, status, page, limit);

      res.status(200).json({
        tasks: result.tasks,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  }

  async create(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token missing' });
      }
      const session = await authService.validateSession(token);
      const fcmToken = session.fcmToken;
      const data = { ...req.body, userId: session.userId };
      const task = await this.service.createTask(data, fcmToken);
      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating task' });
    }
  }

  async update(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token missing' });
      }
      const session = await authService.validateSession(token);
      const fcmToken = session.fcmToken;
      const id = req.params.id;
      const data = req.body;
      const task = await this.service.updateTask(id, data, fcmToken);
      res.status(200).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating task' });
    }
  }
}

const taskService = new TaskService();
module.exports = new TaskController(taskService);