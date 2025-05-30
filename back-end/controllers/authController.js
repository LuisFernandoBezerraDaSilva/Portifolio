const BaseController = require('./baseController');
const AuthService = require('../services/authService');

class AuthController extends BaseController {
  constructor(service) {
    super(service);
  }

  async login(req, res) {
    const { username, password } = req.body;
    try {
      const { token, expiresAt } = await this.service.authenticate(
        username,
        password,
        req.ip,
        req.headers['user-agent']
      );
      console.log(token, expiresAt);
      res.status(200).json({ token, expiresAt });
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized access' });
    }
  }
}

const authService = new AuthService();
module.exports = new AuthController(authService);