let admin, sendNotification;

try {
  admin = require("firebase-admin");
  const serviceAccount = require("../testeslf-firebase-adminsdk-fbsvc-8ab2d7954a.json");

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  sendNotification = async (token, notification) => {
    return admin.messaging().send({
      token,
      notification,
      data: {
        ...notification,
      },
    });
  };
} catch (err) {
  sendNotification = async () => {
    console.warn("FCM desativado: serviceAccount não encontrado ou erro ao inicializar.");
    return null;
  };
}

module.exports = { sendNotification };