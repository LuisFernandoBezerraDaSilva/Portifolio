const { TaskController } = require('../../../controllers/taskController');

describe('TaskController', () => {
  let controller;
  let service;
  let req;
  let res;

  beforeEach(() => {
    service = {
      getAll: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
    };
    controller = new TaskController(service);

    req = {
      user: { id: 1, fcmToken: 'fcm' },
      query: {},
      params: { id: '1' },
      body: { foo: 'bar' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Evita poluir o output dos testes
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

    it('should return tasks on getAll', async () => {
    service.getAll.mockResolvedValue({
      tasks: [{ id: 1 }],
      total: 1,
      page: 1,
      totalPages: 1,
    });
    await controller.getAll(req, res);
    expect(service.getAll).toHaveBeenCalledWith(req.user.id, "", "", 1, 10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      tasks: [{ id: 1 }],
      total: 1,
      page: 1,
      totalPages: 1,
    });
  });

  it('should handle error on getAll', async () => {
    service.getAll.mockRejectedValue(new Error('fail'));
    await controller.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching tasks' });
  });

  it('should create a task', async () => {
    service.createTask.mockResolvedValue({ id: 1, foo: 'bar' });
    await controller.create(req, res);
    expect(service.createTask).toHaveBeenCalledWith({ foo: 'bar', userId: 1 }, 'fcm');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, foo: 'bar' });
  });

  it('should handle error on create', async () => {
    service.createTask.mockRejectedValue(new Error('fail'));
    await controller.create(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error creating task' });
  });

  it('should update a task', async () => {
    service.updateTask.mockResolvedValue({ id: 1, foo: 'baz' });
    await controller.update(req, res);
    expect(service.updateTask).toHaveBeenCalledWith('1', { foo: 'bar' }, 'fcm');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, foo: 'baz' });
  });

  it('should handle error on update', async () => {
    service.updateTask.mockRejectedValue(new Error('fail'));
    await controller.update(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error updating task' });
  });
});