const BaseService = require('./baseService');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
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

    async authenticate(username, password, ip, userAgent) {
      try {
        const user = await this.findByUsername(username);
  
        if (!user || !bcrypt.compareSync(password, user.password)) {
          throw new Error('Invalid credentials');
        }
  
        const sessionToken = uuidv4();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2);
  
        await prisma.session.create({
          data: {
            userId: user.id,
            token: sessionToken,
            expiresAt,
            creationIp: ip || null,
            userAgent: userAgent || null,
            isValid: true,
          },
        });
  
        return { token: sessionToken, expiresAt };
      } catch (e) {
        logger.logError(e);
        throw new Error('Error authenticating user');
      }
    }

  async validateSession(token) {
    try {
      const session = await prisma.session.findUnique({ where: { token } });
      if (
        !session ||
        !session.isValid ||
        new Date(session.expiresAt) < new Date()
      ) {
        throw new Error('Invalid or expired session');
      }
      return session;
    } catch (e) {
      logger.logError(e);
      throw new Error('Session validation failed');
    }
  }
}

module.exports = AuthService;