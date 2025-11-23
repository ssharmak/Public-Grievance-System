import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Grievances() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");

      const res = await axios.get(
        "http://localhost:5000/api/grievances/admin/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRows(res.data);
    } catch (err) {
      console.error("❌ Error loading grievances", err);
      alert("Failed to fetch grievances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns: GridColDef[] = [
    { field: "grievanceId", headerName: "ID", width: 160 },
    { field: "title", headerName: "Title", flex: 1 },
    {
      field: "categoryName",
      headerName: "Category",
      width: 160,
      renderCell: (params) => (
        <Chip label={params.value || "Uncategorized"} color="primary" />
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "High"
              ? "error"
              : params.value === "Medium"
              ? "warning"
              : "success"
          }
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "Submitted"
              ? "info"
              : params.value === "Resolved"
              ? "success"
              : "warning"
          }
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => navigate(`/grievances/${params.row.grievanceId}`)}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        All Grievances
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          autoHeight
          sx={{ background: "#fff", borderRadius: 2 }}
        />
      )}
    </Box>
  );
}
