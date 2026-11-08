import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AddProperty() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", price: "", type: "apartment",
    city: "", address: "", area: "", bedrooms: "", bathrooms: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      files.forEach((f) => data.append("images", f));
      await api.post("/properties", data);
      navigate("/dashboard");
    } catch (err) {
      const er = err as { response?: { data?: { message?: string } } };
      setError(er.response?.data?.message || "Failed to add property");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Property</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Title" value={form.title} onChange={(e) => set("title", e.target.value)} />
        <textarea className="w-full border p-2 rounded" placeholder="Description" value={form.description} onChange={(e) => set("description", e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <input className="border p-2 rounded" type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => set("price", e.target.value)} />
          <select className="border p-2 rounded" value={form.type} onChange={(e) => set("type", e.target.value)}>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
          </select>
          <input className="border p-2 rounded" placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
          <input className="border p-2 rounded" placeholder="Address" value={form.address} onChange={(e) => set("address", e.target.value)} />
          <input className="border p-2 rounded" type="number" placeholder="Area (sqft)" value={form.area} onChange={(e) => set("area", e.target.value)} />
          <input className="border p-2 rounded" type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
          <input className="border p-2 rounded" type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Images (max 4, optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 4))}
          />
        </div>
        <button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
          {saving ? "Saving..." : "Add property"}
        </button>
      </form>
    </div>
  );
}