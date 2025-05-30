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
}

const taskService = new TaskService();
module.exports = new TaskController(taskService);