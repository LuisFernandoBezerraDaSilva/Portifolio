const request = require('./app.integration.spec');

describe('Task Integration', () => {
  let token;
  let createdTaskId;

  const testUser = {
    username: 'taskuser',
    password: 'taskpassword'
  };

  const testTask = {
    title: 'Test Task',
    description: 'Integration test task',
    date: '2025-06-23T12:00:00.000Z',
    status: 'A_FAZER'
  };

  beforeAll(async () => {
    // Register and login user to get token
    await request.post('/auth/register').send(testUser);
    const loginRes = await request.post('/auth/login').send(testUser);
    token = loginRes.body.token;
  });

  it('should create a new task', async () => {
    const response = await request
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(testTask)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(testTask.title);
    createdTaskId = response.body.id;
  });

  it('should get all tasks for the user', async () => {
    const response = await request
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body.tasks)).toBe(true);
    expect(response.body.tasks.length).toBeGreaterThan(0);
  });

  it('should get a single task by id', async () => {
    const response = await request
      .get(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdTaskId);
    expect(response.body.title).toBe(testTask.title);
  });

  it('should update a task', async () => {
    const updated = { title: 'Updated Task Title' };
    const response = await request
      .put(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updated)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdTaskId);
    expect(response.body.title).toBe(updated.title);
  });

  it('should delete a task', async () => {
    await request
      .delete(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });
});