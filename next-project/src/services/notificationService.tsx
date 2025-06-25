import { messaging } from "../../firebase";
import { onMessage } from "firebase/messaging";

export function listenForForegroundNotifications() {
  if (messaging && typeof window !== "undefined") {
    onMessage(messaging, (payload) => {
      const title = payload.notification?.title || payload.data?.title || "Notificação";
      const body = payload.notification?.body || payload.data?.body || "Você recebeu uma mensagem.";
      if (Notification.permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
}