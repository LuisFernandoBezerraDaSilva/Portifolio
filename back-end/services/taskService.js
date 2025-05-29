const BaseService = require('./baseService');
const { PrismaClient } = require('@prisma/client');
const taskSchema = require('../schemas/taskSchema'); 
const prisma = new PrismaClient();
const logger = require('./logService');

class TaskService extends BaseService {
  constructor() {
    super(prisma.task, taskSchema);
  }

  async getAll(token) {
    try {
      const user = await prisma.user.findFirst({
        where: { token },
      });

      if (!user) {
        throw new Error('User not found or invalid token');
      }

      const tasks = await this.model.findMany({
        where: { userId: user.id },
      });

      return tasks;
    } catch (e) {
      logger.logError(e);
      throw new Error('Error fetching tasks for user');
    }
  }
}

module.exports = TaskService;