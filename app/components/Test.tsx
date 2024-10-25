"use client";

import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface Goal {
  id: string;
  name: string;
  description: string;
  deadline: string;
}

const theme = createTheme({
  typography: {
    fontSize: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState<Goal>({
    id: "",
    name: "",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    const storedGoals = localStorage.getItem("goals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.name && newGoal.description && newGoal.deadline) {
      const goalWithId = { ...newGoal, id: Date.now().toString() };
      setGoals((prev) => [...prev, goalWithId]);
      setNewGoal({ id: "", name: "", description: "", deadline: "" });
    }
  };

  const handleDelete = (id: string) => {
    const deleteAlert = confirm("削除しますか");
    if (deleteAlert) {
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h6" component="h1" gutterBottom>
          目標メモ
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <TextField
            fullWidth
            size="small"
            label="目標の名前"
            name="name"
            value={newGoal.name}
            onChange={handleInputChange}
            required
            autoComplete="off"
            margin="normal"
          />
          <TextField
            fullWidth
            size="small"
            label="目標の詳細"
            name="description"
            value={newGoal.description}
            onChange={handleInputChange}
            required
            multiline
            rows={3}
            autoComplete="off"
            margin="normal"
          />
          <TextField
            fullWidth
            size="small"
            label="期限"
            name="deadline"
            type="date"
            value={newGoal.deadline}
            onChange={handleInputChange}
            required
            autoComplete="off"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="small"
            sx={{ mt: 2 }}
          >
            追加
          </Button>
        </form>

        {goals.map((goal) => (
          <Card key={goal.id} sx={{ mb: 2, position: "relative" }}>
            <CardContent sx={{ pb: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleDelete(goal.id)}
                sx={{ position: "absolute", top: 4, right: 4 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              <Typography variant="subtitle2" component="h2" gutterBottom>
                {goal.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {goal.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                期限: {goal.deadline}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Container>
    </ThemeProvider>
  );
}
