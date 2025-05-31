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
      {({ setOpenSnackbar }) => {
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
              router.push("/");
            }, 1500);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            if (
              err?.response?.data?.message === "Username already exists" ||
              err?.message === "Username already exists"
            ) {
              setError("Usuário já existente, favor trocar de usuário!");
            } else {
              setError("Erro ao criar usuário.");
            }
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
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
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