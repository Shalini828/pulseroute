import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import GatewayPage from "../pages/Gateway/Gateway";
import History from "../pages/History/History";
import Logs from "../pages/Logs/Logs";
import Providers from "../pages/Providers/Providers";
import Analytics from "../pages/Analytics/Analytics";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound/NotFound";

import { Navigate } from "react-router-dom";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gateway"
        element={
          <ProtectedRoute>
            <GatewayPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <Logs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/providers"
        element={
          <ProtectedRoute>
            <Providers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>

<Route path="*" element={<NotFound />} />
    </Routes>
  );
}
