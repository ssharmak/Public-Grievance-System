import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("❌ Load categories error", err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!name.trim()) return alert("Enter category name");
    try {
      const token = localStorage.getItem("admin_token");
      await axios.post(
        "http://localhost:5000/api/categories",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      loadCategories();
    } catch (err) {
      alert("Failed to create category");
    }
  };

  const deleteCategory = async (id: string) => {
    const token = localStorage.getItem("admin_token");
    await axios.delete(`http://localhost:5000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadCategories();
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Manage Categories
      </Typography>

      <TextField
        label="New Category"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button sx={{ ml: 2 }} variant="contained" onClick={addCategory}>
        Add
      </Button>

      <Box mt={3}>
        {loading ? (
          <CircularProgress />
        ) : (
          categories.map((cat) => (
            <Chip
              key={cat._id}
              label={cat.name}
              onDelete={() => deleteCategory(cat._id)}
              sx={{ mr: 1, mb: 1 }}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
