"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export default function Home() {
  const [user, setUser] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await authService.login({
        username: user,
        password: senha,
      });
      alert(`Login realizado!\nToken: ${result.token}`);
      localStorage.setItem("accessToken", result.token);
    } catch (err: any) {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
        </Box>
      </Paper>
    </Container>
  );
}