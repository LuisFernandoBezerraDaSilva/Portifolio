const TaskService = require('../../services/taskService');
const prisma = require('../../prisma/prisma');
const logger = require('../../services/logService');
const { schedulingService, cancelScheduledTask } = require('../../services/schedulingService');

jest.mock('../../prisma/prisma', () => ({
  task: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  session: {
    findUnique: jest.fn(),
  },
}));
jest.mock('../../services/logService', () => ({
  logError: jest.fn(),
}));
jest.mock('../../services/schedulingService', () => ({
  schedulingService: jest.fn(),
  cancelScheduledTask: jest.fn(),
}));
jest.mock('../../schemas/taskSchema', () => ({}));
jest.mock('../../helpers/parseDateFilter', () => jest.fn(() => null));

describe('TaskService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TaskService();
  });

  test('getAll should throw if session is invalid', async () => {
    prisma.session.findUnique.mockResolvedValue(null);
    await expect(service.getAll('token')).rejects.toThrow('Error fetching tasks for user');
  });

  test('getAll should return tasks and total', async () => {
    prisma.session.findUnique.mockResolvedValue({
      userId: 1,
      isValid: true,
      expiresAt: new Date(Date.now() + 10000),
      user: {},
    });
    prisma.task.findMany.mockResolvedValue([{ id: 1, title: 'Task' }]);
    prisma.task.count.mockResolvedValue(1);

    const result = await service.getAll('token');
    expect(result.tasks).toEqual([{ id: 1, title: 'Task' }]);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  test('createTask should create and schedule task', async () => {
    const taskData = { title: 'Task' };
    prisma.task.create.mockResolvedValue({ id: 1, ...taskData });
    const fcmToken = 'fcm';
    const result = await service.createTask(taskData, fcmToken);
    expect(prisma.task.create).toHaveBeenCalledWith({ data: taskData });
    expect(schedulingService).toHaveBeenCalledWith({ id: 1, ...taskData }, fcmToken);
    expect(result).toEqual({ id: 1, ...taskData });
  });

  test('updateTask should update and reschedule task', async () => {
    const taskData = { title: 'Task updated' };
    prisma.task.update.mockResolvedValue({ id: 1, ...taskData });
    const fcmToken = 'fcm';
    const result = await service.updateTask(1, taskData, fcmToken);
    expect(cancelScheduledTask).toHaveBeenCalledWith(1);
    expect(prisma.task.update).toHaveBeenCalledWith({ where: { id: 1 }, data: taskData });
    expect(schedulingService).toHaveBeenCalledWith({ id: 1, ...taskData }, fcmToken);
    expect(result).toEqual({ id: 1, ...taskData });
  });

  test('deleteTask should cancel schedule and delete', async () => {
    prisma.task.delete.mockResolvedValue({ id: 1 });
    const result = await service.deleteTask(1);
    expect(cancelScheduledTask).toHaveBeenCalledWith(1);
    expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual({ id: 1 });
  });

  test('getAll should log and throw on error', async () => {
    prisma.session.findUnique.mockRejectedValue(new Error('fail'));
    await expect(service.getAll('token')).rejects.toThrow('Error fetching tasks for user');
    expect(logger.logError).toHaveBeenCalled();
  });

  test('createTask should log and throw on error', async () => {
    prisma.task.create.mockRejectedValue(new Error('fail'));
    await expect(service.createTask({})).rejects.toThrow('Error creating task');
    expect(logger.logError).toHaveBeenCalled();
  });

  test('updateTask should log and throw on error', async () => {
    prisma.task.update.mockRejectedValue(new Error('fail'));
    await expect(service.updateTask(1, {})).rejects.toThrow('Error updating task');
    expect(logger.logError).toHaveBeenCalled();
  });

  test('deleteTask should log and throw on error', async () => {
    prisma.task.delete.mockRejectedValue(new Error('fail'));
    await expect(service.deleteTask(1)).rejects.toThrow('Error deleting task');
    expect(logger.logError).toHaveBeenCalled();
  });
});