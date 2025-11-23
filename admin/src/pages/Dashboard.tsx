import React from "react";
import { Box, Typography, Button } from "@mui/material";

export default function Dashboard() {
  const logout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700}>
        Admin Dashboard
      </Typography>

      <Typography mt={2}>Welcome Admin!</Typography>

      <Button
        variant="contained"
        sx={{ mt: 3, mr: 2 }}
        onClick={() => (window.location.href = "/grievances")}
      >
        Manage Grievances
      </Button>

      <Button
        variant="contained"
        sx={{ mt: 3, mr: 2 }}
        onClick={() => (window.location.href = "/categories")}
      >
        Manage Categories
      </Button>

      <Button variant="outlined" sx={{ mt: 3 }} onClick={logout}>
        Logout
      </Button>
    </Box>
  );
}
