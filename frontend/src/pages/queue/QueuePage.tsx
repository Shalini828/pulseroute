import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getQueueJobs } from "../../services/dashboard.service";
import { socket } from "../../services/socket";
import { toast } from "react-toastify";

export default function QueuePage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedResponse, setSelectedResponse] = useState("");

  const loadJobs = async () => {
    try {
      const res = await getQueueJobs();
      setJobs(res.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();

    const interval = setInterval(loadJobs, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleJobUpdated = (data: any) => {
      console.log("📡 Job Updated:", data);

      loadJobs();

      if (data.status === "COMPLETED") {
        toast.success(`Job ${data.jobId.slice(0, 8)} completed!`);
      }

      if (data.status === "FAILED") {
        toast.error(`Job ${data.jobId.slice(0, 8)} failed.`);
      }
    };
    socket.on("job-updated", handleJobUpdated);

    return () => {
      socket.off("job-updated", handleJobUpdated);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Queue Dashboard</h1>

        <input
          type="text"
          placeholder="Search by Job ID or Provider..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="ALL">All Jobs</option>
          <option value="QUEUED">Queued</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="w-full border border-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  <th className="p-3 text-left">Job ID</th>
                  <th className="p-3 text-left">Provider</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Latency</th>
                  <th className="p-3 text-left">Created</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {jobs
                  .filter((job) => {
                    const matchesSearch =
                      job.id.toLowerCase().includes(search.toLowerCase()) ||
                      (job.provider ?? "")
                        .toLowerCase()
                        .includes(search.toLowerCase());

                    const matchesStatus =
                      statusFilter === "ALL" || job.status === statusFilter;

                    return matchesSearch && matchesStatus;
                  })
                  .map((job) => (
                    <tr key={job.id} className="border-t border-slate-700">
                      <td className="p-3">{job.id.slice(0, 10)}...</td>

                      <td className="p-3">{job.provider}</td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === "COMPLETED"
                              ? "bg-green-600 text-white"
                              : job.status === "PROCESSING"
                                ? "bg-blue-600 text-white"
                                : job.status === "FAILED"
                                  ? "bg-red-600 text-white"
                                  : "bg-yellow-600 text-white"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>

                      <td className="p-3">
                        {job.latency ? `${job.latency} ms` : "-"}
                      </td>

                      <td className="p-3">
                        {new Date(job.createdAt).toLocaleString()}
                      </td>

                      <td className="p-3">
                        {job.status === "COMPLETED" ? (
                          <button
                            onClick={() => setSelectedResponse(job.response)}
                            className="rounded-lg bg-blue-600 px-3 py-1 hover:bg-blue-700"
                          >
                            View
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {selectedResponse && (
              <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">
                <h2 className="mb-4 text-xl font-semibold">AI Response</h2>

                <div className="whitespace-pre-wrap rounded-lg bg-slate-800 p-4">
                  {selectedResponse}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
