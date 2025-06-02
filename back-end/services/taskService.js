const BaseService = require('./baseService');
const prisma = require('../prisma/prisma');
const taskSchema = require('../schemas/taskSchema');
const logger = require('./logService');
const parseDateFilter = require('../helpers/parseDateFilter');
const { schedulingService, cancelScheduledTask } = require('./schedulingService');

class TaskService extends BaseService {
  constructor() {
    super(prisma.task, taskSchema);
  }

  async getAll(token, filter, status, page = 1, limit = 10) {
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
        let dateFilter = parseDateFilter(filter);
        where.OR = [
          { title: { contains: filter, mode: "insensitive" } },
          { description: { contains: filter, mode: "insensitive" } },
        ];
        if (dateFilter) {
          where.OR.push({ date: { contains: dateFilter, mode: "insensitive" } });
        } else {
          where.OR.push({ date: { contains: filter, mode: "insensitive" } });
        }
        const statusValues = ["CONCLUIDO", "EM_ANDAMENTO", "A_FAZER"];
        if (statusValues.includes(filter.toUpperCase())) {
          where.OR.push({ status: { equals: filter.toUpperCase() } });
        }
      }

      if (status && ["CONCLUIDO", "EM_ANDAMENTO", "A_FAZER"].includes(status.toUpperCase())) {
        where.status = status.toUpperCase();
      }

      const skip = (page - 1) * limit;

      const [tasks, total] = await Promise.all([
        this.model.findMany({
          where,
          skip,
          take: limit,
          orderBy: { date: 'desc' }
        }),
        this.model.count({ where })
      ]);

      return {
        tasks,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (e) {
      logger.logError(e);
      throw new Error('Error fetching tasks for user');
    }
  }

  async createTask(data, fcmToken) {
    try {
      const task = await this.model.create({ data });
      if (fcmToken) {
        schedulingService(task, fcmToken);
      }
      return task;
    } catch (e) {
      logger.logError(e);
      throw new Error('Error creating task');
    }
  }

  async updateTask(id, data, fcmToken) {
    try {
      cancelScheduledTask(id);
      const task = await this.model.update({ where: { id }, data });
      if (fcmToken) {
        schedulingService(task, fcmToken);
      }
      return task;
    } catch (e) {
      logger.logError(e);
      throw new Error('Error updating task');
    }
  }

  async deleteTask(id) {
    try {
      // Cancela o agendamento antes de deletar
      cancelScheduledTask(id);
      return this.model.delete({ where: { id } });
    } catch (e) {
      logger.logError(e);
      throw new Error('Error deleting task');
    }
  }
}

module.exports = TaskService;