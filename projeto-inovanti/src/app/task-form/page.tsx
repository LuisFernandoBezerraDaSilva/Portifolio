"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container, Typography, TextField, Button, Box, Paper, MenuItem } from "@mui/material";
import { TaskService } from "../../services/taskService";
import { Task } from "../../interfaces/task";
import { BaseComponent } from "../../components/baseComponent";
import { TaskStatus } from "../../enums/taskStatus";

const taskService = new TaskService();

function TaskFormContent() {
  const [task, setTask] = useState<Omit<Task, "userId">>({
    title: "",
    description: "",
    date: "",
    status: TaskStatus.A_FAZER,
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
            status: data.status,
          });
        } catch {
          setError("Erro ao carregar tarefa.");
        }
      }
    };
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
        setTask({ title: "", description: "", date: "", status: TaskStatus.A_FAZER });
      }
      setTimeout(() => {
        router.push("/task-list");
      }, 1500);
    } catch {
      setError("Erro ao salvar tarefa.");
      setIsSubmitting(false);
    }
  };

  return (
    <BaseComponent
      snackbarMessage={success || error}
      snackbarSeverity={success ? "success" : "error"}
    >
      {({ setOpenSnackbar }) => (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              {id ? "Editar Tarefa" : "Criar Nova Tarefa"}
            </Typography>
            <Box
              component="form"
              onSubmit={async (e) => {
                await handleSubmit(e);
                setOpenSnackbar(true);
              }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
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
                label="Data e Horário"
                name="date"
                type="datetime-local"
                value={task.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                select
                label="Status"
                name="status"
                value={task.status}
                onChange={handleChange}
                required
              >
                <MenuItem value={TaskStatus.A_FAZER}>A fazer</MenuItem>
                <MenuItem value={TaskStatus.EM_ANDAMENTO}>Em andamento</MenuItem>
                <MenuItem value={TaskStatus.CONCLUIDO}>Concluído</MenuItem>
              </TextField>
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
      )}
    </BaseComponent>
  );
}

export default function TaskFormPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <TaskFormContent />
    </Suspense>
  );
}