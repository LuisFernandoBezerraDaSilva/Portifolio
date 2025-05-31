"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { AuthService } from "../services/authService";

import { app, messaging } from "../../firebase";
import { getToken } from "firebase/messaging";

const authService = new AuthService();

export default function Home() {
  const [user, setUser] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function registerAndGetToken() {
      if (typeof window !== "undefined" && "serviceWorker" in navigator && messaging) {
        try {
          const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          const fcmToken = await getToken(messaging, {
            vapidKey: "BIyRbPvL6m5Om4H78LlCP9EavuCJ9stOTd6z4yrCIXJ-vnKFyRfyBIajdvvZgmLZ2FbF5i1fC_G0IrzRFJJltsU",
            serviceWorkerRegistration: registration,
          });
          if (fcmToken) {
            console.log("FCM Token:", fcmToken);
            localStorage.setItem("fcmToken", fcmToken);
          }
        } catch (fcmError) {
          console.error("Erro ao obter token FCM:", fcmError);
        }
      }
    }
    registerAndGetToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  try {
    const fcmToken = localStorage.getItem("fcmToken");
    const result = await authService.login({
      username: user,
      password: senha,
      fcmToken: fcmToken || undefined,
    });
    localStorage.setItem("accessToken", result.token);
    router.push("/task-list");
  } catch (err: any) {
    setError("Usuário ou senha inválidos");
  }
};

  return (
    <Container
      className="login-container"
      maxWidth="sm"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Usuário"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            fullWidth
          />
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Entrar
          </Button>
          <Typography
            sx={{
              mt: 2,
              color: "primary.main",
              textDecoration: "underline",
              cursor: "pointer",
              textAlign: "center",
              fontWeight: 500,
            }}
            onClick={() => router.push("/user-form")}
          >
            criar conta!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}