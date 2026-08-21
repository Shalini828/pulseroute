import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus } from "lucide-react";
import { toast } from "react-toastify";
import { projectService } from "../../services/project.service";

export default function CreateProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await projectService.createProject(form);

      toast.success("Project created successfully!");

      navigate("/projects");
    } catch (error) {
      console.error(error);

      toast.error("Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-2xl bg-blue-600 p-4">
            <FolderPlus size={32} />
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              Create Your First Project
            </h1>

            <p className="mt-2 text-slate-400">
              Every API request, provider, analytics report and API Key belongs
              to a project.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleCreate}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block text-slate-300">
              Project Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="My AI Gateway"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-slate-300">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your project..."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none transition focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating Project..."
              : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}