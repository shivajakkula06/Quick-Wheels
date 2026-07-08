import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-green-400 transition-colors">
          Vehicle Rental
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-green-400 transition-colors">
            Home
          </Link>

          <Link to="/my-bookings" className="hover:text-green-400 transition-colors">
            My Bookings
          </Link>

          <Link to="/history" className="hover:text-green-400 transition-colors">
            Rental History
          </Link>

          <Link to="/admin" className="hover:text-green-400 transition-colors font-medium text-blue-400">
            Admin Panel
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm">
                Hello, <strong className="text-white font-semibold">{user.name}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="bg-green-500 px-4 py-2 rounded text-sm font-medium hover:bg-green-600 transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-500 px-4 py-2 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;