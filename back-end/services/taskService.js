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
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || !session.isValid || new Date(session.expiresAt) < new Date()) {
      throw new Error('User not found or invalid/expired token');
    }

    const tasks = await this.model.findMany({
      where: { userId: session.userId },
    });

    return tasks;
  } catch (e) {
    logger.logError(e);
    throw new Error('Error fetching tasks for user');
  }
}
}

module.exports = TaskService;