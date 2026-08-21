import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FolderPen } from "lucide-react";
import { toast } from "react-toastify";

import { projectService } from "../../services/project.service";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    async function loadProject() {
      try {
        if (!id) return;

        const response = await projectService.getProjectById(id);

        setForm({
          name: response.data.name,
          description: response.data.description || "",
        });
      } catch (error) {
        toast.error("Failed to load project.");
      }
    }

    loadProject();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!id) return;

      await projectService.updateProject(id, form);

      toast.success("Project updated successfully!");

      navigate("/projects");
    } catch (error) {
      toast.error("Failed to update project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-2xl bg-blue-600 p-4">
            <FolderPen size={30} />
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              Edit Project
            </h1>

            <p className="mt-2 text-slate-400">
              Update your project details.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleUpdate}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block">
              Project Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4"
            />
          </div>

          <div>
            <label className="mb-2 block">
              Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-semibold hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update Project"}
          </button>
        </form>
      </div>
    </div>
  );
}