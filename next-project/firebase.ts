import { initializeApp, getApps } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Configuração do Firebase (dados escritos manualmente)
const firebaseConfig = {
  apiKey: "AIzaSyBa8BdNH41g_11VOUd5oQk-W4_Z1BYYyqQ",
  authDomain: "testeslf.firebaseapp.com",
  projectId: "testeslf",
  storageBucket: "testeslf.firebasestorage.app",
  messagingSenderId: "595706168707",
  appId: "1:595706168707:web:aaaa3a6a6f41713922a2b6",
  measurementId: "G-MJ2NEEWMJE"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let messaging: ReturnType<typeof getMessaging> | undefined = undefined;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  messaging = getMessaging(app);
}

export { app, messaging };