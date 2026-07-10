import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import GatewayPage from "../pages/Gateway/Gateway";
import History from "../pages/History/History";
import Logs from "../pages/Logs/Logs";


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

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
    </Routes>
  );
}
