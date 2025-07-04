const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUserFromToken(token) {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (
    !session ||
    !session.isValid ||
    new Date(session.expiresAt) < new Date()
  ) {
    return null;
  }
  // Incluir o fcmToken da sessão no objeto do usuário
  return {
    ...session.user,
    fcmToken: session.fcmToken
  };
}

module.exports = getUserFromToken;