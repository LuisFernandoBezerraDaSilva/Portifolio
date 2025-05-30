const admin = require("firebase-admin");
const serviceAccount = require("../testeslf-firebase-adminsdk-fbsvc-8ab2d7954a.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function sendNotification(token, notification) {
  return admin.messaging().send({
    token,
    notification,
  });
}

module.exports = { sendNotification };