import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

type Property = {
  _id: string;
  title: string;
  price: number;
  location: { city: string };
};

type Appointment = {
  _id: string;
  date: string;
  status: string;
  property: { _id: string; title: string; location: { city: string } } | null;
};

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const load = async () => {
    const [p, a] = await Promise.all([
      api.get("/properties/mine"),
      api.get("/appointments/mine"),
    ]);
    setProperties(p.data.properties);
    setAppointments(a.data.appointments);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteProperty = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    await api.delete(`/properties/${id}`);
    load();
  };

  const cancel = async (id: string) => {
    await api.put(`/appointments/${id}/cancel`);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">My Listings</h2>
          <Link to="/add-property" className="bg-blue-600 text-white px-3 py-1 rounded">+ Add property</Link>
        </div>
        {properties.length === 0 && <p>No listings yet.</p>}
        <div className="space-y-2">
          {properties.map((p) => (
            <div key={p._id} className="border rounded p-3 flex justify-between items-center">
              <div>
                <Link to={`/property/${p._id}`} className="font-semibold">{p.title}</Link>
                <p className="text-sm text-gray-600">{p.location.city} • ₹{p.price.toLocaleString("en-IN")}</p>
              </div>
              <button onClick={() => deleteProperty(p._id)} className="text-red-600">Delete</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">My Appointments</h2>
        {appointments.length === 0 && <p>No appointments yet.</p>}
        <div className="space-y-2">
          {appointments.map((a) => (
            <div key={a._id} className="border rounded p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold">{a.property?.title || "Property removed"}</p>
                <p className="text-sm text-gray-600">
                  {new Date(a.date).toLocaleString()} • <span className="capitalize">{a.status}</span>
                </p>
              </div>
              {a.status !== "cancelled" && (
                <button onClick={() => cancel(a._id)} className="text-red-600">Cancel</button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}