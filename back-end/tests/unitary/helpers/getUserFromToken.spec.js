const getUserFromToken = require('../../../helpers/getUserFromToken');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client', () => {
  const mSession = {
    findUnique: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => ({
      session: mSession,
    })),
  };
});

describe('getUserFromToken', () => {
  let prisma;
  let sessionMock;

  beforeEach(() => {
    prisma = new PrismaClient();
    sessionMock = prisma.session;
    jest.clearAllMocks();
  });

  it('should return null if no token is provided', async () => {
    const result = await getUserFromToken();
    expect(result).toBeNull();
    expect(sessionMock.findUnique).not.toHaveBeenCalled();
  });

  it('should return null if session is not found', async () => {
    sessionMock.findUnique.mockResolvedValue(null);
    const result = await getUserFromToken('token');
    expect(sessionMock.findUnique).toHaveBeenCalledWith({
      where: { token: 'token' },
      include: { user: true },
    });
    expect(result).toBeNull();
  });

  it('should return null if session is not valid', async () => {
    sessionMock.findUnique.mockResolvedValue({
      isValid: false,
      expiresAt: new Date(Date.now() + 10000),
      user: { id: 1 },
    });
    const result = await getUserFromToken('token');
    expect(result).toBeNull();
  });

  it('should return null if session is expired', async () => {
    sessionMock.findUnique.mockResolvedValue({
      isValid: true,
      expiresAt: new Date(Date.now() - 10000),
      user: { id: 1 },
    });
    const result = await getUserFromToken('token');
    expect(result).toBeNull();
  });

  it('should return user if session is valid and not expired', async () => {
    const user = { id: 1, username: 'test' };
    sessionMock.findUnique.mockResolvedValue({
      isValid: true,
      expiresAt: new Date(Date.now() + 10000),
      user,
    });
    const result = await getUserFromToken('token');
    expect(result).toEqual(user);
  });
});