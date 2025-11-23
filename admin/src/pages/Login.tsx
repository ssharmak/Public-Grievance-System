import React, { useState } from "react";
import { TextField, Button, Card, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      if (
        res.data.user.role !== "admin" &&
        res.data.user.role !== "superadmin"
      ) {
        return alert("Unauthorized: Not an Admin");
      }

      localStorage.setItem("admin_token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ width: 380, p: 4 }}>
        <Typography variant="h5" fontWeight={700} align="center" mb={3}>
          Admin Login
        </Typography>

        <TextField
          fullWidth
          label="Email or Phone"
          margin="normal"
          onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Login
        </Button>
      </Card>
    </Box>
  );
}
