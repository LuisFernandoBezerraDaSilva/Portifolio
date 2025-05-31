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
  Pagination,
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const service = new TaskService();

  const fetchTasks = async (
    filterValue: string = "",
    statusValue: string = "",
    pageValue: number = 1
  ) => {
    try {
      const data = await service.getAllTasks(filterValue, statusValue, pageValue, 5);
      setTasks(data.tasks);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      setTasks([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchTasks(filter, status, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      setPage(1); 
      fetchTasks(filter, status, 1);
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
      setPage(1);
      fetchTasks(filter, status, 1);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => b.date.localeCompare(a.date));

  const handleEdit = (id: string) => {
    router.push(`/task-form?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await service.deleteTask(id);
      await fetchTasks(filter, status, page);
      setSnackbarMsg("Tarefa deletada com sucesso!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <SnackbarComponent
        open={openSnackbar}
        message={snackbarMsg}
        onClose={handleCloseSnackbar}
        severity="success"
      />
    </Container>
  );
}