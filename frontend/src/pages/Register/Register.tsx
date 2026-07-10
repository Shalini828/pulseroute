import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert("Registration successful!");

      navigate("/");
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md space-y-5 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-white">
          Create Account
        </h1>

        <p className="text-slate-400">
          Welcome to PulseRoute
        </p>

        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
          value={form.password}
          onChange={handleChange}
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 font-semibold"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center text-slate-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>

    </div>
  );
}