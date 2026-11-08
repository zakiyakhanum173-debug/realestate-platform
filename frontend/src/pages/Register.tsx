import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.phone, form.password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" value={form.password} onChange={(e) => set("password", e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
      <p className="mt-3 text-sm">
        Have an account? <Link className="text-blue-600" to="/login">Login</Link>
      </p>
    </div>
  );
}