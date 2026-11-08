import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetail from "./pages/PropertyDetail";
import Dashboard from "./pages/Dashboard";
import AddProperty from "./pages/AddProperty";
import ProtectedRoute from "./components/ProtectedRoute";

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="flex justify-between items-center px-6 py-3 border-b">
      <Link to="/" className="font-bold text-xl">RealEstate</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/add-property">Add Property</Link>
            <span>Hi, {user.name}</span>
            <button onClick={logout} className="text-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add-property" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );   
}