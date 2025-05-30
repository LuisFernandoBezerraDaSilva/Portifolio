"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container, Typography, TextField, Button, Box, Paper } from "@mui/material";
import { TaskService } from "../../services/taskService";
import { Task } from "../../interfaces/task";
import { BaseComponent } from "../../components/baseComponent";

const taskService = new TaskService();

export default function TaskForm() {
  const [task, setTask] = useState<Omit<Task, "userId">>({
    title: "",
    description: "",
    date: "",
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      if (id) {
        try {
          const data = await taskService.getTask(id);
          setTask({
            title: data.title,
            description: data.description,
            date: data.date,
          });
        } catch (err) {
          setError("Erro ao carregar tarefa.");
        }
      }
    };
    fetchTask();
  }, [id]);

  return (
    <BaseComponent
      snackbarMessage={success || error}
      snackbarSeverity={success ? "success" : "error"}
    >
      {({ openSnackbar, setOpenSnackbar, handleOpenSnackbar, handleCloseSnackbar }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setTask({ ...task, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsSubmitting(true);
          setError(null);
          setSuccess(null);
          try {
            if (id) {
              await taskService.updateTask(id, task);
              setSuccess("Tarefa atualizada com sucesso!");
            } else {
              await taskService.createTask(task);
              setSuccess("Tarefa criada com sucesso!");
              setTask({ title: "", description: "", date: "" });
            }
            setOpenSnackbar(true);
            setTimeout(() => {
              router.push("/task-list");
            }, 1500);
          } catch (err) {
            setError("Erro ao salvar tarefa.");
            setOpenSnackbar(true);
          }
        };

        return (
          <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                {id ? "Editar Tarefa" : "Criar Nova Tarefa"}
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {id ? "Salvar Alterações" : "Criar Tarefa"}
                </Button>
              </Box>
            </Paper>
          </Container>
        );
      }}
    </BaseComponent>
  );
}