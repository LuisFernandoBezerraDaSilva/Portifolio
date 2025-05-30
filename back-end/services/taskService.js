const BaseService = require('./baseService');
const { PrismaClient } = require('@prisma/client');
const taskSchema = require('../schemas/taskSchema'); 
const prisma = new PrismaClient();
const logger = require('./logService');

class TaskService extends BaseService {
  constructor() {
    super(prisma.task, taskSchema);
  }

    async getAll(token, filter, status) {
    try {
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });
  
      if (!session || !session.isValid || new Date(session.expiresAt) < new Date()) {
        throw new Error('User not found or invalid/expired token');
      }
  
      const where = {
        userId: session.userId,
      };
  
      if (filter) {
        where.OR = [
          { title: { contains: filter, mode: "insensitive" } },
          { description: { contains: filter, mode: "insensitive" } },
          { date: { contains: filter, mode: "insensitive" } },
        ];
        const statusValues = ["CONCLUIDO", "EM_ANDAMENTO", "A_FAZER"];
        if (statusValues.includes(filter.toUpperCase())) {
          where.OR.push({ status: { equals: filter.toUpperCase() } });
        }
      }
  
      if (status && ["CONCLUIDO", "EM_ANDAMENTO", "A_FAZER"].includes(status.toUpperCase())) {
        where.status = status.toUpperCase();
      }
  
      const tasks = await this.model.findMany({ where });
      return tasks;
    } catch (e) {
      logger.logError(e);
      throw new Error('Error fetching tasks for user');
    }
  }
}

module.exports = TaskService;