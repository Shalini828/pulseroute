import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projectService } from "../services/project.service";

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface ProjectContextType {
  project: Project | null;
  projects: Project[];
  loading: boolean;
  setProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextType>({
  project: null,
  projects: [],
  loading: true,
  setProject: () => {},
});

export function ProjectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const [project, setProjectState] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);

        const response = await projectService.getProjects();

        const loadedProjects = response.data || [];

        console.log("Projects:", loadedProjects);

        if (loadedProjects.length === 0) {
          setProjects([]);
          setProjectState(null);
          navigate("/create-project");
          return;
        }

        setProjects(loadedProjects);

        // Check if user already selected a project
        const savedProjectId = localStorage.getItem("selectedProjectId");

        const savedProject = loadedProjects.find(
          (item: Project) => item.id === savedProjectId,
        );

        // Use saved project, otherwise use first project
        const selectedProject = savedProject || loadedProjects[0];

        setProjectState(selectedProject);

        localStorage.setItem(
          "selectedProjectId",
          selectedProject.id,
        );

        console.log("Selected Project:", selectedProject);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [navigate]);

  const setProject = (selectedProject: Project) => {
    setProjectState(selectedProject);

    localStorage.setItem(
      "selectedProjectId",
      selectedProject.id,
    );

    console.log("Switched Project:", selectedProject);
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        projects,
        loading,
        setProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}