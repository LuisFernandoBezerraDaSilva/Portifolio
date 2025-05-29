const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.tokenRevoked) {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = authenticateToken;