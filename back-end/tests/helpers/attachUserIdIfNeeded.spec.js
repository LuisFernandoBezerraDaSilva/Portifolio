const attachUserIdIfNeeded = require('../../helpers/attachUserIdIfNeeded');
const getUserFromToken = require('../../helpers/getUserFromToken');

jest.mock('../../helpers/getUserFromToken');

describe('attachUserIdIfNeeded', () => {
  let model;
  let data;
  let req;

  beforeEach(() => {
    model = {
      fields: [{ name: 'userId' }, { name: 'otherField' }],
    };
    data = { some: 'value' };
    req = {
      headers: { authorization: 'Bearer testtoken' },
    };
    jest.clearAllMocks();
  });

  it('should attach userId if model has userId, token exists, and data.userId is missing', async () => {
    getUserFromToken.mockResolvedValue({ id: 42 });
    const result = await attachUserIdIfNeeded(model, { ...data }, req);
    expect(getUserFromToken).toHaveBeenCalledWith('testtoken');
    expect(result.userId).toBe(42);
  });

  it('should not overwrite existing userId', async () => {
    getUserFromToken.mockResolvedValue({ id: 99 });
    const result = await attachUserIdIfNeeded(model, { ...data, userId: 10 }, req);
    expect(getUserFromToken).not.toHaveBeenCalled();
    expect(result.userId).toBe(10);
  });

  it('should not attach userId if model does not have userId field', async () => {
    model.fields = [{ name: 'otherField' }];
    const result = await attachUserIdIfNeeded(model, { ...data }, req);
    expect(getUserFromToken).not.toHaveBeenCalled();
    expect(result.userId).toBeUndefined();
  });

  it('should not attach userId if no authorization header', async () => {
    req.headers = {};
    const result = await attachUserIdIfNeeded(model, { ...data }, req);
    expect(getUserFromToken).not.toHaveBeenCalled();
    expect(result.userId).toBeUndefined();
  });

  it('should not attach userId if getUserFromToken returns no user', async () => {
    getUserFromToken.mockResolvedValue(null);
    const result = await attachUserIdIfNeeded(model, { ...data }, req);
    expect(getUserFromToken).toHaveBeenCalledWith('testtoken');
    expect(result.userId).toBeUndefined();
  });
});