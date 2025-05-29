"use client";
import { useState } from "react";
import { Container, Typography, List, ListItem, ListItemText, TextField, Box } from "@mui/material";

export default function TaskList() {
  const [tasks] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  const filteredTasks = tasks.filter(task =>
    task.toLowerCase().includes(filter.toLowerCase())
  );

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
      </Box>
      <List>
        {filteredTasks.map((task, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={task} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}