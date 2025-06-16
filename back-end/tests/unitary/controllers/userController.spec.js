const UserController = require('../../../controllers/userController');

describe('UserController', () => {
  let controller;
  let service;
  let req;
  let res;

  beforeEach(() => {
    service = {
      getUserByUsername: jest.fn(),
    };
    controller = new UserController.constructor(service);

    req = {
      params: { username: 'testuser' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return user when found', async () => {
    const user = { id: 1, username: 'testuser' };
    service.getUserByUsername.mockResolvedValue(user);

    await controller.getUserByUsername(req, res);

    expect(service.getUserByUsername).toHaveBeenCalledWith('testuser');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('should return 404 when user is not found', async () => {
    service.getUserByUsername.mockRejectedValue(new Error('User not found'));

    await controller.getUserByUsername(req, res);

    expect(service.getUserByUsername).toHaveBeenCalledWith('testuser');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });
});