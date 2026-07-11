import DashboardLayout from "../../components/layout/DashboardLayout";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Settings</h1>

          <p className="text-slate-400 mt-2">
            Manage your PulseRoute preferences.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="grid md:grid-cols-2 gap-6">

  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-xl font-semibold mb-4">
      Profile
    </h2>

    <div className="space-y-3">
      <p>
        <span className="text-slate-400">Name:</span> Demo User
      </p>

      <p>
        <span className="text-slate-400">Email:</span> demo@example.com
      </p>
    </div>
  </div>

  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
    <h2 className="text-xl font-semibold mb-4">
      Application
    </h2>

    <div className="space-y-3">
      <p>
        <span className="text-slate-400">Version:</span> v1.0.0
      </p>

      <p>
        <span className="text-slate-400">Environment:</span> Development
      </p>
    </div>
  </div>

</div>
        </div>
      </div>
    </DashboardLayout>
  );
}