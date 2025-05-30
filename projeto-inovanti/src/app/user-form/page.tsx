"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, TextField, Button, Box, Paper } from "@mui/material";
import { UserService } from "../../services/userService";
import { BaseComponent } from "../../components/baseComponent";

const userService = new UserService();

export default function UserForm() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  return (
    <BaseComponent
      snackbarMessage={success || error}
      snackbarSeverity={success ? "success" : "error"}
    >
      {({ openSnackbar, setOpenSnackbar, handleOpenSnackbar, handleCloseSnackbar }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setUser({ ...user, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsSubmitting(true);
          setError(null);
          setSuccess(null);
          try {
            await userService.createUser(user);
            setSuccess("Usuário criado com sucesso!");
            setUser({ username: "", password: "" });
            setOpenSnackbar(true);
            setTimeout(() => {
              router.push("/user-list");
            }, 1500);
          } catch (err) {
            setError("Erro ao criar usuário.");
            setOpenSnackbar(true);
            setIsSubmitting(false);
          }
        };

        return (
          <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Criar Novo Usuário
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Usuário"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Senha"
                  name="password"
                  type="password"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  Criar Usuário
                </Button>
              </Box>
            </Paper>
          </Container>
        );
      }}
    </BaseComponent>
  );
}