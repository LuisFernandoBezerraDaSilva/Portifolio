const BaseService = require('./baseService');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const logger = require('./logService');

class AuthService extends BaseService {
  constructor() {
    const authSchema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
    super(prisma.user, authSchema);
  }

  async findByUsername(username) {
    try {
      return await this.model.findUnique({ where: { username } });
    } catch (e) {
      logger.logError(e);
      throw new Error('Error finding user by username');
    }
  }

  generateAccessToken(user) {
    try {
      const secretKey = process.env.JWT_SECRET;
      const expiresIn = process.env.JWT_EXPIRATION || '15m';
      return jwt.sign({ id: user.id }, secretKey, { expiresIn });
    } catch (e) {
      logger.logError(e);
      throw new Error('Error generating access token');
    }
  }

  async authenticate(username, password) {
    try {
      const user = await this.findByUsername(username);

      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error('Invalid credentials');
      }

      const accessToken = this.generateAccessToken(user);

      await this.model.update({
        where: { id: user.id },
        data: { token: accessToken },
      });

      return { token: accessToken, userId: user.id };
    } catch (e) {
      logger.logError(e);
      throw new Error('Error authenticating user');
    }
  }
}

module.exports = AuthService;