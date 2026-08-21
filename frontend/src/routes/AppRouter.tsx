import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import GatewayPage from "../pages/Gateway/Gateway";
import History from "../pages/History/History";
import Logs from "../pages/Logs/Logs";
import Providers from "../pages/Providers/Providers";
import Analytics from "../pages/Analytics/Analytics";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound/NotFound";
import CreateProject from "../pages/CreateProject/CreateProject";
import QueuePage from "../pages/queue/QueuePage";
import Projects from "../pages/Projects/Projects";
import EditProject from "../pages/Projects/EditProject";

import ApiKeys from "../pages/ApiKeys/ApiKeys";

import { Navigate } from "react-router-dom";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

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


<Route
  path="/create-project"
  element={
    <ProtectedRoute>
      <CreateProject />
    </ProtectedRoute>
  }
/>

<Route
  path="/projects/edit/:id"
  element={
    <ProtectedRoute>
    <EditProject />
    </ProtectedRoute>
  }
/>

<Route
  path="/apikeys"
  element={
    <ProtectedRoute>
      <ApiKeys />
    </ProtectedRoute>
  }
/>

<Route path="/queue" element={<QueuePage />} />

<Route
  path="/projects"
  element={
    <ProtectedRoute>
      <Projects />
    </ProtectedRoute>
  }
/>

<Route path="*" element={<NotFound />} />
    </Routes>
  );
}
