const getUserFromToken = require('./getUserFromToken');

async function attachUserIdIfNeeded(model, data, req) {
  if (
    model &&
    model.fields &&
    model.fields.some(f => f.name === 'userId') &&
    req &&
    req.headers &&
    req.headers.authorization
  ) {
    const token = req.headers.authorization.split(' ')[1];
    if (token && !data.userId) {
      const user = await getUserFromToken(token);
      if (user && user.id) {
        data.userId = user.id;
      }
    }
  }
  return data;
}

module.exports = attachUserIdIfNeeded;