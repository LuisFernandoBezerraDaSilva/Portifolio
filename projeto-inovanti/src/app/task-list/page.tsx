"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { TaskService } from "../../services/taskService";
import { formatDateBR } from "../../helpers/formatDateBr";
import { Task } from "../../interfaces/task";
import { SnackbarComponent } from "../../components/snackbar";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const service = new TaskService();
        const data = await service.getAllTasks();
        setTasks(data);
      } catch (error) {
        setTasks([]);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(filter.toLowerCase())
  );

  const handleEdit = (id: string) => {
    router.push(`/task-form?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const service = new TaskService();
      await service.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setSnackbarMsg("Tarefa deletada com sucesso!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Tarefas
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Filtrar tarefa"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/task-form")}
          sx={{ whiteSpace: "nowrap", height: 56 }}
        >
          Nova Tarefa
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Data</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{formatDateBR(task.date)}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    sx={{ mr: 1 }}
                    onClick={() => handleEdit(task.id!)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: "#d32f2f",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#b71c1c" },
                      minWidth: 0,
                      padding: "3px",
                    }}
                    onClick={() => handleDelete(task.id!)}
                  >
                    <DeleteIcon sx={{ color: "#fff" }} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SnackbarComponent
        open={openSnackbar}
        message={snackbarMsg}
        onClose={handleCloseSnackbar}
        severity="success"
      />
    </Container>
  );
}