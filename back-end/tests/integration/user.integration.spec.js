const request = require('./app.integration.spec');

describe('User Integration', () => {
  const testUser = {
    username: 'testuser',
    password: 'testpassword'
  };

  it('deve registrar um novo usuário com sucesso', async () => {
    const response = await request
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(testUser.username);
  });
});