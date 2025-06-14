const UserService = require('../../services/userService');
const bcrypt = require('bcryptjs');

jest.mock('../../prisma/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock('../../services/logService', () => ({
  logError: jest.fn(),
}));
jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(() => 'hashedPassword'),
}));

const prisma = require('../../prisma/prisma');
const logger = require('../../services/logService');

describe('UserService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService();
  });

  describe('create', () => {
    it('should create a new user if username does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 1, username: 'test', password: 'hashedPassword' });

      const data = { username: 'test', password: '123' };
      const result = await service.create(data);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'test' } });
      expect(bcrypt.hashSync).toHaveBeenCalledWith('123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { username: 'test', password: 'hashedPassword' },
      });
      expect(result).toEqual({ id: 1, username: 'test', password: 'hashedPassword' });
    });

    it('should throw error if username already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, username: 'test' });

      await expect(service.create({ username: 'test', password: '123' }))
        .rejects.toThrow('Username already exists');
    });

    it('should throw generic error if create fails', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockRejectedValue(new Error('db error'));

      await expect(service.create({ username: 'test', password: '123' }))
        .rejects.toThrow('Error creating user');
      expect(logger.logError).toHaveBeenCalled();
    });
  });

  describe('getUserByUsername', () => {
    it('should return user if found', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, username: 'test' });

      const result = await service.getUserByUsername('test');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'test' } });
      expect(result).toEqual({ id: 1, username: 'test' });
    });

    it('should throw error if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserByUsername('notfound'))
        .rejects.toThrow('User not found');
      expect(logger.logError).toHaveBeenCalled();
    });

    it('should throw generic error if findUnique fails', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error('db error'));

      await expect(service.getUserByUsername('test'))
        .rejects.toThrow('Error getting user');
      expect(logger.logError).toHaveBeenCalled();
    });
  });
});