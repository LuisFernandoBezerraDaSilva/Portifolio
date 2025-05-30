importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBa8BdNH41g_11VOUd5oQk-W4_Z1BYYyqQ",
  authDomain: "testeslf.firebaseapp.com",
  projectId: "testeslf",
  storageBucket: "testeslf.firebasestorage.app",
  messagingSenderId: "595706168707",
  appId: "1:595706168707:web:aaaa3a6a6f41713922a2b6",
  measurementId: "G-MJ2NEEWMJE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  });
});