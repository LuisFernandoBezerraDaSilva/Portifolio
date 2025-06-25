const BaseController = require('./baseController');
const UserService = require('../services/userService');

class UserController extends BaseController {
  constructor(service) {
    super(service);
  }

  async getUserByUsername(req, res) {
    try {
      const { username } = req.params;
      const user = await this.service.getUserByUsername(username);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

const userService = new UserService();
module.exports = new UserController(userService);