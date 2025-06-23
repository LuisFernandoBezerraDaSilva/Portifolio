const request = require('./app.integration.spec');

describe('Auth Integration', () => {
  const testUser = {
    username: 'loginuser',
    password: 'loginpassword'
  };

  beforeAll(async () => {
    // Cria o usuário para o teste de login
    await request.post('/auth/register').send(testUser);
  });

  it('should login successfully with valid credentials', async () => {
    const response = await request
      .post('/auth/login')
      .send(testUser)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('expiresAt');
  });

  it('should fail login with invalid credentials', async () => {
    const response = await request
      .post('/auth/login')
      .send({ username: testUser.username, password: 'wrongpassword' })
      .expect(401);

    expect(response.body).toHaveProperty('error');
  });
});