const BaseController = require('./baseController');
const AuthService = require('../services/authService');

class AuthController extends BaseController {
  constructor(service) {
    super(service);
  }

    async login(req, res) {
    const { username, password, fcmToken } = req.body;
    try {
      const { token, expiresAt } = await this.service.authenticate(
        username,
        password,
        req.ip,
        req.headers['user-agent'],
        fcmToken
      );
      res.status(200).json({ token, expiresAt });
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized access' });
    }
  }
}

const authService = new AuthService();
module.exports = new AuthController(authService);