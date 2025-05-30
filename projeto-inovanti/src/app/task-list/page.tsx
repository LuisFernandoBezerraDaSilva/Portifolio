"use client";
import { useEffect, useRef, useState } from "react";
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
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { TaskService } from "../../services/taskService";
import { formatDateBR } from "../../helpers/formatDateBr";
import { Task } from "../../interfaces/task";
import { SnackbarComponent } from "../../components/snackbar";
import { taskStatusToLabel } from "@/helpers/taskStatusToLabel";
import { TaskStatus } from "@/enums/taskStatus";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const router = useRouter();

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const service = new TaskService();

  const fetchTasks = async (filterValue: string = "", statusValue: string = "") => {
    try {
      const data = await service.getAllTasks(filterValue, statusValue);
      setTasks(data);
    } catch (error) {
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      console.log("aqui!");
      fetchTasks(filter, status);
    }, 2000);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [filter, status]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const handleFilterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      console.log("aqui!");
      fetchTasks(filter, status);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => b.date.localeCompare(a.date));

  const handleEdit = (id: string) => {
    router.push(`/task-form?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
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
          onChange={handleFilterChange}
          onKeyDown={handleFilterKeyDown}
          fullWidth
        />
        <TextField
          select
          label="Status"
          value={status}
          onChange={handleStatusChange}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value={TaskStatus.A_FAZER}>A fazer</MenuItem>
          <MenuItem value={TaskStatus.EM_ANDAMENTO}>Em andamento</MenuItem>
          <MenuItem value={TaskStatus.CONCLUIDO}>Concluído</MenuItem>
        </TextField>
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
              <TableCell>Data</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Status</TableCell>
              <TableCell
                align="center"
                sx={{
                  position: "sticky",
                  right: 0,
                  background: "#fff",
                  zIndex: 1,
                  minWidth: 120,
                  maxWidth: 400,
                }}
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{formatDateBR(task.date)}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{taskStatusToLabel(task.status)}</TableCell>
                <TableCell
                  align="center"
                  sx={{
                    position: "sticky",
                    right: 0,
                    background: "#fff",
                    zIndex: 1,
                    minWidth: 120,
                    maxWidth: 400,
                  }}
                >
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