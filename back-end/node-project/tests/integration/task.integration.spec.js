const request = require('./app.integration.spec');

describe('Task Integration', () => {
  let token;
  let createdTaskId;
  let otherToken;

  const testUser = {
    username: 'taskuser',
    password: 'taskpassword'
  };

  const otherUser = {
    username: 'taskuser1',
    password: 'taskpassword1'
  };

  const testTask = {
    title: 'Test Task',
    description: 'Integration test task',
    date: '2025-06-23T12:00:00.000Z',
    status: 'A_FAZER'
  };

  beforeAll(async () => {
    await request.post('/auth/register').send(testUser);
    const loginRes = await request.post('/auth/login').send(testUser);
    token = loginRes.body.token;

    await request.post('/auth/register').send(otherUser);
    const otherLoginRes = await request.post('/auth/login').send(otherUser);
    otherToken = otherLoginRes.body.token;
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
    expect(response.body.tasks.some(t => t.id === createdTaskId)).toBe(true);
  });

  it('should not show the created task to another user', async () => {
    const response = await request
      .get('/tasks')
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(200);

    expect(Array.isArray(response.body.tasks)).toBe(true);
    expect(response.body.tasks.some(t => t.id === createdTaskId)).toBe(false);
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