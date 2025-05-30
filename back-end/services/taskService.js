const BaseService = require('./baseService');
const { PrismaClient } = require('@prisma/client');
const taskSchema = require('../schemas/taskSchema'); 
const prisma = new PrismaClient();
const logger = require('./logService');

class TaskService extends BaseService {
  constructor() {
    super(prisma.task, taskSchema);
  }

  async getAll(token, filter) {
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
        // Monta OR apenas para campos string
        where.OR = [
          { title: { contains: filter, mode: "insensitive" } },
          { description: { contains: filter, mode: "insensitive" } },
          { date: { contains: filter, mode: "insensitive" } },
        ];
  
        // Se o filtro for igual a algum status do enum, adiciona no OR
        const statusValues = ["CONCLUIDO", "EM_ANDAMENTO", "A_FAZER"];
        if (statusValues.includes(filter.toUpperCase())) {
          where.OR.push({ status: { equals: filter.toUpperCase() } });
        }
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