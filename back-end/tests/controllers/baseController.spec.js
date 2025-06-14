const BaseController = require('../../controllers/baseController');

describe('BaseController', () => {
  let service;
  let controller;
  let req;
  let res;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      getAll: jest.fn(),
      getOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    controller = new BaseController(service);

    req = {
      body: { foo: 'bar' },
      params: { id: '123' },
      user: { id: 42 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  it('should create an item and return 201', async () => {
    service.create.mockResolvedValue({ foo: 'bar', userId: 42 });
    await controller.create(req, res);
    expect(service.create).toHaveBeenCalledWith({ foo: 'bar', userId: 42 });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ foo: 'bar', userId: 42 });
  });

  it('should handle create error', async () => {
    service.create.mockRejectedValue(new Error('fail'));
    await controller.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
  });

  it('should get all items and return 200', async () => {
    service.getAll.mockResolvedValue([{ foo: 'bar' }]);
    await controller.getAll(req, res);
    expect(service.getAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ foo: 'bar' }]);
  });

  it('should handle getAll error', async () => {
    service.getAll.mockRejectedValue(new Error('fail'));
    await controller.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
  });

  it('should get one item and return 200', async () => {
    service.getOne.mockResolvedValue({ foo: 'bar' });
    await controller.getOne(req, res);
    expect(service.getOne).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should handle getOne error', async () => {
    service.getOne.mockRejectedValue(new Error('fail'));
    await controller.getOne(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
  });

  it('should update an item and return 200', async () => {
    service.update.mockResolvedValue({ foo: 'baz' });
    await controller.update(req, res);
    expect(service.update).toHaveBeenCalledWith('123', { foo: 'bar' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ foo: 'baz' });
  });

  it('should handle update error', async () => {
    service.update.mockRejectedValue(new Error('fail'));
    await controller.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
  });

  it('should delete an item and return 204', async () => {
    service.delete.mockResolvedValue();
    await controller.delete(req, res);
    expect(service.delete).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('should handle delete error', async () => {
    service.delete.mockRejectedValue(new Error('fail'));
    await controller.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
  });
});