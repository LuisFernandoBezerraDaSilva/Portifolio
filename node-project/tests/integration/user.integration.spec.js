const request = require('./app.integration.spec');

describe('User Integration', () => {
  const testUser = {
    username: 'testuser',
    password: 'testpassword'
  };

  const otherUser = {
    username: 'taskuser1',
    password: 'taskpassword1'
  };

  it('should successfully register a new user', async () => {
    const response = await request
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(testUser.username);
  });

  it('should successfully register another user', async () => {
    const response = await request
      .post('/auth/register')
      .send(otherUser)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(otherUser.username);
  });
});