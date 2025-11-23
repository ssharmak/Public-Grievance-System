import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  MenuItem,
  Select,
  Button,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const STATUS_OPTIONS = [
  "Submitted",
  "In Review",
  "Assigned",
  "Resolved",
  "Closed",
];

export default function GrievanceDetails() {
  const { id } = useParams(); // grievanceId
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [note, setNote] = useState("");

  const load = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await axios.get(
        `http://localhost:5000/api/grievances/admin/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
      setStatus(res.data.grievance.status);
    } catch (err) {
      console.error("DETAIL ERROR:", err);
      alert("Failed to load grievance details");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      await axios.patch(
        `http://localhost:5000/api/grievances/admin/${id}/status`,
        { status, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Status updated");
      load();
    } catch (err: any) {
      console.error("STATUS UPDATE ERROR:", err.response?.data || err);
      alert("Failed to update status");
    }
  };

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const { grievance, history } = data;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Grievance {grievance.grievanceId}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">{grievance.title}</Typography>
          <Typography sx={{ mt: 1 }}>{grievance.description}</Typography>

          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={grievance.category?.name || "Uncategorized"}
              color="primary"
            />
            <Chip label={grievance.priority} color="warning" />
            <Chip label={grievance.status} color="info" />
          </Box>

          <Typography sx={{ mt: 2 }} color="text.secondary">
            Created At: {new Date(grievance.createdAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Update Status
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              size="small"
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>

            <Button variant="contained" onClick={handleUpdateStatus}>
              Save
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Note (optional)"
            multiline
            minRows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>
            Status History
          </Typography>

          {history.length === 0 ? (
            <Typography>No history available.</Typography>
          ) : (
            history.map((h: any) => (
              <Box key={h._id} sx={{ mb: 1 }}>
                <Typography>
                  <strong>{h.oldStatus || "N/A"}</strong> →{" "}
                  <strong>{h.newStatus}</strong> by{" "}
                  {h.changedBy
                    ? `${h.changedBy.firstName} ${h.changedBy.lastName}`
                    : "System"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(h.createdAt).toLocaleString()}{" "}
                  {h.note ? `— ${h.note}` : ""}
                </Typography>
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
