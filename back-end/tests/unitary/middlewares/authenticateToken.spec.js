const authenticateToken = require('../../../middlewares/authenticateToken');
const getUserFromToken = require('../../../helpers/getUserFromToken');
const logger = require('../../../services/logService');

jest.mock('../../../helpers/getUserFromToken');
jest.mock('../../../services/logService', () => ({
  logError: jest.fn(),
}));

describe('authenticateToken middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 403 if no token is provided', async () => {
    req.headers = {};
    await authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if getUserFromToken returns null', async () => {
    req.headers.authorization = 'Bearer token';
    getUserFromToken.mockResolvedValue(null);
    await authenticateToken(req, res, next);
    expect(getUserFromToken).toHaveBeenCalledWith('token');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next and set req.user if token is valid', async () => {
    req.headers.authorization = 'Bearer token';
    const user = { id: 1, username: 'test' };
    getUserFromToken.mockResolvedValue(user);
    await authenticateToken(req, res, next);
    expect(getUserFromToken).toHaveBeenCalledWith('token');
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 and log error if exception is thrown', async () => {
    req.headers.authorization = 'Bearer token';
    getUserFromToken.mockRejectedValue(new Error('fail'));
    await authenticateToken(req, res, next);
    expect(logger.logError).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    expect(next).not.toHaveBeenCalled();
  });
});