import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

type Property = {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: { city: string; address: string };
  images: { url: string }[];
  owner?: { name: string; email: string; phone?: string };
};

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);

  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", message: "" });
  const [msg, setMsg] = useState("");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    api
      .get(`/properties/${id}`)
      .then((res) => setProperty(res.data.property))
      .catch(() => setError("Property not found"));
  }, [id]);

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const book = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    setBookingError("");
    try {
      if (user) {
        await api.post("/appointments", {
          property: id,
          date: form.date,
          message: form.message,
          phone: form.phone,
        });
      } else {
        await api.post("/appointments/guest", { property: id, ...form });
      }
      setMsg("Viewing booked successfully!");
      setForm({ name: "", email: "", phone: "", date: "", message: "" });
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setBookingError(e.response?.data?.message || "Booking failed");
    }
  };

  if (error) return <p className="p-6">{error}</p>;
  if (!property) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="h-80 bg-gray-200 rounded-lg overflow-hidden">
          {property.images[activeImg] ? (
            <img src={property.images[activeImg].url} alt={property.title} className="w-full h-full object-cover" />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">No image</div>
          )}
        </div>
        {property.images.length > 1 && (
          <div className="flex gap-2 mt-2">
            {property.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                onClick={() => setActiveImg(i)}
                className={`h-16 w-24 object-cover rounded cursor-pointer border-2 ${i === activeImg ? "border-blue-600" : "border-transparent"}`}
              />
            ))}
          </div>
        )}

        <h1 className="text-2xl font-bold mt-4">{property.title}</h1>
        <p className="text-gray-600">{property.location.address}, {property.location.city}</p>
        <p className="text-2xl font-bold mt-2">₹{property.price.toLocaleString("en-IN")}</p>
        <p className="mt-2 text-sm">
          {property.type} • {property.area} sqft • {property.bedrooms} bed • {property.bathrooms} bath
        </p>
        <p className="mt-4">{property.description}</p>
        {property.owner && (
          <p className="mt-4 text-sm text-gray-600">Listed by {property.owner.name}</p>
        )}
      </div>

      <form onSubmit={book} className="border rounded-lg p-4 space-y-3 h-fit">
        <h2 className="text-lg font-bold">Book a viewing</h2>
        {msg && <p className="text-green-600">{msg}</p>}
        {bookingError && <p className="text-red-600">{bookingError}</p>}
        {!user && (
          <>
            <input className="w-full border p-2 rounded" placeholder="Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
            <input className="w-full border p-2 rounded" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </>
        )}
        <input className="w-full border p-2 rounded" placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <input className="w-full border p-2 rounded" type="datetime-local" value={form.date} onChange={(e) => set("date", e.target.value)} />
        <textarea className="w-full border p-2 rounded" placeholder="Message (optional)" value={form.message} onChange={(e) => set("message", e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Book viewing</button>
        {user && <p className="text-xs text-gray-500">Booking as {user.name}</p>}
      </form>
    </div>
  );
}