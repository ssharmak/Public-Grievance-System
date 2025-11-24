import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import DashboardPage from './pages/DashboardPage';
import GrievanceQueuePage from './pages/GrievanceQueuePage';
import GrievanceDetailsPage from './pages/GrievanceDetailsPage';
import SystemAdminPage from './pages/SystemAdminPage';
import LoginPage from './pages/LoginPage';

// Private Route Component
const PrivateRoute = () => {
  const { user } = useAuth();
  
  // Check if user is authenticated and not a citizen (role check)
  const isAuthenticated = user && (user.role === 'official' || user.role === 'super_admin' || user.role === 'admin' || user.role === 'superadmin');

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/admin" element={<PrivateRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="queue" element={<GrievanceQueuePage />} />
          <Route path="grievance/:grievanceId" element={<GrievanceDetailsPage />} />
          <Route path="system" element={<SystemAdminPage />} />
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
