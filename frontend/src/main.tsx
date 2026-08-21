import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "./routes/AppRouter";
import { ProjectProvider } from "./context/ProjectContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProjectProvider>
        <AppRouter />
      </ProjectProvider>
    </BrowserRouter>
  </React.StrictMode>,
);