const schedule = require('node-schedule');
const { sendNotification } = require('../../services/fcmService');
const prisma = require('../../prisma/prisma');

jest.mock('node-schedule', () => ({
  scheduleJob: jest.fn(() => ({
    cancel: jest.fn(),
  })),
}));
jest.mock('../../services/fcmService', () => ({
  sendNotification: jest.fn(),
}));
jest.mock('../../prisma/prisma', () => ({
  task: {
    findMany: jest.fn(),
  },
}));

const {
  schedulingService,
  cancelScheduledTask,
  scheduleUserTasks,
} = require('../../services/schedulingService');

describe('schedulingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should schedule a new job and send notification', () => {
    const task = { id: 1, title: 'Tarefa', description: 'Desc', date: new Date().toISOString() };
    const fcmToken = 'token';
    schedulingService(task, fcmToken);

    expect(schedule.scheduleJob).toHaveBeenCalled();
  });

  it('should cancel and reschedule if job already exists', () => {
    const task = { id: 2, title: 'Tarefa', description: 'Desc', date: new Date().toISOString() };
    const fcmToken = 'token';

    // First schedule
    schedulingService(task, fcmToken);
    // Second schedule with same id should cancel previous
    schedulingService(task, fcmToken);

    expect(schedule.scheduleJob).toHaveBeenCalledTimes(2);
  });

  it('should cancel scheduled task', () => {
    const task = { id: 3, title: 'Tarefa', description: 'Desc', date: new Date().toISOString() };
    const fcmToken = 'token';
    schedulingService(task, fcmToken);

    expect(() => cancelScheduledTask(task.id)).not.toThrow();
  });

  it('should schedule all user tasks', async () => {
    const userId = 123;
    const fcmToken = 'token';
    const tasks = [
      { id: 10, title: 'A', description: 'B', date: new Date().toISOString() },
      { id: 11, title: 'C', description: 'D', date: new Date().toISOString() },
    ];
    prisma.task.findMany.mockResolvedValue(tasks);

    await scheduleUserTasks(userId, fcmToken);

    expect(prisma.task.findMany).toHaveBeenCalled();
    expect(schedule.scheduleJob).toHaveBeenCalledTimes(tasks.length);
  });
});