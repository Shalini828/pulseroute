import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, FolderPlus } from "lucide-react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { projectService } from "../../services/project.service";

interface Project {
  id: string;
  name: string;
  description?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const loadProjects = async () => {
    try {
      setLoading(true);

      const response = await projectService.getProjects();

      setProjects(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async () => {
    if (!deleteProject) return;

    try {
      setDeleting(true);

      await projectService.deleteProject(deleteProject.id);

      toast.success("Project deleted successfully.");

      setDeleteProject(null);

      await loadProjects();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-lg">Loading projects...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>

            <p className="mt-1 text-slate-400">
              Total Projects: {projects.length}
            </p>
          </div>

          <button
            onClick={() => navigate("/create-project")}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700"
          >
            <FolderPlus size={18} />
            New Project
          </button>
        </div>

        {/* Empty State */}
        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center">
            <h2 className="text-2xl font-semibold">No Projects Found</h2>

            <p className="mt-2 text-slate-400">
              Create your first project to start using PulseRoute.
            </p>

            <button
              onClick={() => navigate("/create-project")}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="space-y-5">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-700 bg-slate-800 p-6 transition hover:border-blue-500"
                >
                  <h2 className="text-2xl font-bold">{project.name}</h2>

                  <p className="mt-2 text-slate-400">
                    {project.description || "No description provided."}
                  </p>

                  <div className="mt-4">
                    <p className="text-sm text-slate-500">Project ID</p>

                    <code className="text-blue-400">{project.id}</code>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => navigate(`/projects/edit/${project.id}`)}
                      className="flex items-center gap-2 rounded-xl border border-blue-500 px-5 py-2 text-blue-400 transition hover:bg-blue-500 hover:text-white"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteProject(project)}
                      className="flex items-center gap-2 rounded-xl border border-red-500 px-5 py-2 text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {deleteProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <Trash2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  Delete Project?
                </h2>

                <p className="text-sm text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/60 p-4">
              <p className="text-sm text-slate-400">
                You are about to permanently delete:
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {deleteProject.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">{deleteProject.id}</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteProject(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-600 px-5 py-2.5 font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
