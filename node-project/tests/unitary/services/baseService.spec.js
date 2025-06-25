const BaseService = require('../../../services/baseService');

const mockModel = {
  create: jest.fn(),
  findMany: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const mockSchema = {
  validate: jest.fn(() => ({ error: null })),
  _type: 'testEntity'
};

jest.mock('../../../services/logService', () => ({
  logError: jest.fn(),
}));

describe('BaseService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BaseService(mockModel, mockSchema);
  });

  test('create should call model.create and return result', async () => {
    mockModel.create.mockResolvedValue({ id: 1 });
    const data = { name: 'test', user: true };
    const result = await service.create(data);
    expect(mockModel.create).toHaveBeenCalledWith({ data });
    expect(result).toEqual({ id: 1 });
  });

  test('getAll should call model.findMany and return result', async () => {
    mockModel.findMany.mockResolvedValue([{ id: 1 }]);
    const result = await service.getAll();
    expect(mockModel.findMany).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }]);
  });

  test('getOne should return item if found', async () => {
    mockModel.findUnique.mockResolvedValue({ id: 1 });
    const result = await service.getOne(1);
    expect(mockModel.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual({ id: 1 });
  });

  test('getOne should throw if not found', async () => {
    mockModel.findUnique.mockResolvedValue(null);
    await expect(service.getOne(1)).rejects.toThrow('Error getting record for testEntity');
  });

  test('update should call model.update and return result', async () => {
    mockModel.update.mockResolvedValue({ id: 1, name: 'updated' });
    const result = await service.update(1, { name: 'updated' });
    expect(mockModel.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'updated' },
    });
    expect(result).toEqual({ id: 1, name: 'updated' });
  });

  test('delete should call model.delete and return result', async () => {
    mockModel.delete.mockResolvedValue({ id: 1 });
    const result = await service.delete(1);
    expect(mockModel.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual({ id: 1 });
  });

  test('validate should throw on schema error', () => {
    mockSchema.validate.mockReturnValueOnce({ error: { details: [{ message: 'fail' }] } });
    expect(() => service.validate({ bad: 'data' }, mockSchema)).toThrow('Error validating record for testEntity');
  });
});