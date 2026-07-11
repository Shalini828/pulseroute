import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-blue-500">404</h1>

        <h2 className="text-3xl font-bold mt-6">
          Page Not Found
        </h2>

        <p className="text-slate-400 mt-3">
          Sorry, the page you're looking for doesn't exist.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}