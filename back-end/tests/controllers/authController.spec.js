const { AuthController } = require('../../controllers/authController');

jest.mock('../../services/authService');

describe('AuthController', () => {
  let controller;
  let service;
  let req;
  let res;

  beforeEach(() => {
    service = {
      authenticate: jest.fn(),
    };
    controller = new AuthController(service);

    req = {
      body: { username: 'user', password: 'pass', fcmToken: 'token' },
      ip: '127.0.0.1',
      headers: { 'user-agent': 'jest' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return token and expiresAt on successful login', async () => {
    service.authenticate.mockResolvedValue({ token: 'abc', expiresAt: 'date' });

    await controller.login(req, res);

    expect(service.authenticate).toHaveBeenCalledWith(
      'user',
      'pass',
      '127.0.0.1',
      'jest',
      'token'
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: 'abc', expiresAt: 'date' });
  });

  it('should return 401 on failed login', async () => {
    service.authenticate.mockRejectedValue(new Error('fail'));

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized access' });
  });
});