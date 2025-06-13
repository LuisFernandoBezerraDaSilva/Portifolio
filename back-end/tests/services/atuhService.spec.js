const AuthService = require('../../services/authService');
const bcrypt = require('bcryptjs');

jest.mock('../../prisma/prisma', () => ({
  user: {
    findUnique: jest.fn(),
  },
  session: {
    deleteMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));
jest.mock('../../services/logService', () => ({
  logError: jest.fn(),
}));
jest.mock('../../services/schedulingService', () => ({
  scheduleUserTasks: jest.fn(),
}));

const prisma = require('../../prisma/prisma');
const { scheduleUserTasks } = require('../../services/schedulingService');

describe('AuthService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService();
  });

  test('findByUsername should return user if found', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, username: 'user' });
    const user = await service.findByUsername('user');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'user' } });
    expect(user).toEqual({ id: 1, username: 'user' });
  });

  test('authenticate should throw on invalid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1, username: 'user', password: 'hash' });
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
    await expect(service.authenticate('user', 'wrongpass')).rejects.toThrow('Error authenticating user');
  });

  test('authenticate should create session and return token', async () => {
    const user = { id: 1, username: 'user', password: 'hash' };
    prisma.user.findUnique.mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
    prisma.session.create.mockResolvedValue({});
    prisma.session.deleteMany.mockResolvedValue({});
    scheduleUserTasks.mockResolvedValue();

    const result = await service.authenticate('user', 'pass', 'ip', 'agent', 'fcm');
    expect(prisma.session.deleteMany).toHaveBeenCalledWith({ where: { fcmToken: 'fcm' } });
    expect(prisma.session.create).toHaveBeenCalled();
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('expiresAt');
  });

  test('validateSession should return session if valid', async () => {
    const session = { token: 'abc', isValid: true, expiresAt: new Date(Date.now() + 10000) };
    prisma.session.findUnique.mockResolvedValue(session);
    const result = await service.validateSession('abc');
    expect(result).toEqual(session);
  });

  test('validateSession should throw if session is invalid', async () => {
    prisma.session.findUnique.mockResolvedValue(null);
    await expect(service.validateSession('abc')).rejects.toThrow('Session validation failed');
  });
});