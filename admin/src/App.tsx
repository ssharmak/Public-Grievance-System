import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import Grievances from "./pages/Grievances";
import GrievanceDetails from "./pages/GrievanceDetails";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Private (Admin Protected) Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/grievances"
          element={
            <PrivateRoute>
              <Grievances />
            </PrivateRoute>
          }
        />

        <Route
          path="/grievances/:id"
          element={
            <PrivateRoute>
              <GrievanceDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
