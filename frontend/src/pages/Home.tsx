import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

type Property = {
  _id: string;
  title: string;
  price: number;
  type: string;
  area: number;
  bedrooms: number;
  location: { city: string; address: string };
  images: { url: string }[];
};

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({ city: "", type: "", minPrice: "", maxPrice: "" });
  const [loading, setLoading] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    const { data } = await api.get("/properties", { params });
    setProperties(data.properties);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        <input className="border p-2 rounded" placeholder="City" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
        <select className="border p-2 rounded" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>
        <input className="border p-2 rounded" placeholder="Min price" type="number" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Max price" type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        <button onClick={fetchProperties} className="bg-blue-600 text-white rounded p-2">Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && properties.length === 0 && <p>No properties found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((p) => (
          <Link to={`/property/${p._id}`} key={p._id} className="border rounded-lg overflow-hidden hover:shadow-lg">
            <div className="h-44 bg-gray-200">
              {p.images[0] && <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />}
            </div>
            <div className="p-3">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.location.city} • {p.type} • {p.area} sqft</p>
              <p className="font-bold mt-1">₹{p.price.toLocaleString("en-IN")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}