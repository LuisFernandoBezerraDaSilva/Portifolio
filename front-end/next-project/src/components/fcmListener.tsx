"use client";
import { useEffect } from "react";
import { listenForForegroundNotifications } from "../services/notificationService";

export default function FCMListener() {
  useEffect(() => {
    listenForForegroundNotifications();
  }, []);
  return null;
}