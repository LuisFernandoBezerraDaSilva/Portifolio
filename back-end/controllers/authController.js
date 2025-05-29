const BaseController = require('./baseController');
const AuthService = require('../services/authService');

class AuthController extends BaseController {
  constructor(service) {
    super(service);
  }

  async login(req, res) {
    const { username, password } = req.body;
    try {
      const { token, userId } = await this.service.authenticate(username, password);
      res.status(200).json({ token, userId });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

const authService = new AuthService();
module.exports = new AuthController(authService);