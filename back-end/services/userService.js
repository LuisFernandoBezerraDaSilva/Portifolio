const BaseService = require('./baseService');
const { PrismaClient } = require('@prisma/client');
const userSchema = require('../schemas/userSchema');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const logger = require('./logService');

class UserService extends BaseService {
  constructor() {
    super(prisma.user, userSchema);
  }

  async create(data) {
  try {
    this.validate(data, this.schema);

    const existingUser = await this.model.findUnique({
      where: { username: data.username },
    });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(data.password, saltRounds);

    const userData = { ...data, password: hashedPassword };

    return await this.model.create({ data: userData });
  } catch (e) {
    logger.logError(e);
    if (e.message === 'Username already exists') {
      throw new Error('Username already exists');
    }
    throw new Error('Error creating user');
  }
}

  async getUserByUsername(username) {
    try {
      const user = await this.model.findUnique({
        where: { username },
      });
      if (!user) throw new Error('User not found');
      return user;
    } catch (e) {
      logger.logError(e);
      throw new Error('Error getting user');
    }
  }
}

module.exports = UserService;