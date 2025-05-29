const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (
      !session ||
      !session.isValid ||
      new Date(session.expiresAt) < new Date()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user = session.user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = authenticateToken;