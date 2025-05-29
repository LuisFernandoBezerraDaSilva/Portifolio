const BaseController = require('./baseController');
const TaskService = require('../services/taskService');

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

      const tasks = await this.service.getAll(token); 
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  }
}

const taskService = new TaskService();
module.exports = new TaskController(taskService);