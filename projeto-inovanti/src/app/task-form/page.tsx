"use client";
import { useState } from "react";
import { Container, Typography, TextField, Button, Box, Paper } from "@mui/material";
import { TaskService } from "../../services/taskService";
import { Task } from "../../interfaces/task";

const taskService = new TaskService();

export default function TaskForm() {
  const [task, setTask] = useState<Omit<Task, "userId">>({
    title: "",
    description: "",
    date: "",
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      // @ts-ignore
      await taskService.createTask(task);
      setSuccess("Tarefa criada com sucesso!");
      setTask({ title: "", description: "", date: "" });
    } catch (err) {
      setError("Erro ao criar tarefa.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Criar Nova Tarefa
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Título"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
          />
          <TextField
            label="Descrição"
            name="description"
            value={task.description}
            onChange={handleChange}
            required
          />
          <TextField
            label="Data"
            name="date"
            type="date"
            value={task.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Criar Tarefa
          </Button>
          {success && (
            <Typography color="success.main">{success}</Typography>
          )}
          {error && (
            <Typography color="error">{error}</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}