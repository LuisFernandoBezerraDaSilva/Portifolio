const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const getUserFromToken = require('../helpers/getUserFromToken');
const logger = require('../services/logService');

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const user = await getUserFromToken(token);

    if (!user) {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user = user;
    next();
  } catch (err) {
      logger.logError(err);

    return res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = authenticateToken;