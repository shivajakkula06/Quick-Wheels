import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminVehicleTable from "../components/AdminVehicleTable";

function AdminDashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Admin Security Password gate check
  const [authorized, setAuthorized] = useState(() => {
    return sessionStorage.getItem("admin_authorized") === "true";
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalBookings: 0,
    availableVehicles: 0,
  });
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check admin role
  useEffect(() => {
    if (!user || user.role !== "admin") {
      alert("Access Denied: Admin only.");
      navigate("/");
    } else if (user.name === "vinaykumar") {
      setAuthorized(true);
      setActiveTab("vehicles");
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch Stats
      const statsRes = await fetch("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!statsRes.ok) throw new Error("Failed to fetch dashboard stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      // 2. Fetch Vehicles
      const vehiclesRes = await fetch("http://localhost:5000/api/vehicles");
      if (!vehiclesRes.ok) throw new Error("Failed to fetch vehicles");
      const vehiclesData = await vehiclesRes.json();
      setVehicles(
        vehiclesData.map((v) => ({
          id: v._id,
          name: v.name,
          brand: v.brand,
          type: v.type,
          price: v.pricePerDay,
          image: v.image,
          available: v.available,
        }))
      );

      // 3. Fetch Bookings
      const bookingsRes = await fetch("http://localhost:5000/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);

      // 4. Fetch Activities
      const activitiesRes = await fetch("http://localhost:5000/api/admin/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!activitiesRes.ok) throw new Error("Failed to fetch activities");
      const activitiesData = await activitiesRes.json();
      setActivities(activitiesData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user && user.role === "admin" && authorized) {
      fetchData();
    }
  }, [token, user, authorized]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (adminPasswordInput === "@JAI HANUMAN") {
      setAuthorized(true);
      sessionStorage.setItem("admin_authorized", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect Admin Security Key! Access Denied.");
      setAdminPasswordInput("");
    }
  };

  const addVehicle = async () => {
    const name = prompt("Vehicle Name (e.g. Fortuner)");
    const brand = prompt("Brand (e.g. Toyota)");
    const type = prompt("Type (Car/Bike)");
    const pricePerDay = prompt("Price per Day (₹)");
    const image = prompt("Image Path (e.g. /cars/swift.jpg)");

    if (!name || !brand || !type || !pricePerDay || !image) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          brand,
          type,
          pricePerDay: Number(pricePerDay),
          image,
          available: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to add vehicle");
      alert("Vehicle added successfully!");
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete vehicle");
      alert("Vehicle deleted successfully!");
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/${editingVehicle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingVehicle.name,
          brand: editingVehicle.brand,
          type: editingVehicle.type,
          pricePerDay: Number(editingVehicle.price),
          image: editingVehicle.image,
          available: editingVehicle.available,
        }),
      });

      if (!response.ok) throw new Error("Failed to update vehicle");
      alert("Vehicle updated successfully!");
      setEditingVehicle(null);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user || user.role !== "admin") return null;

  // Render Lock Screen if not authorized with security key
  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 px-6 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fadeIn text-center">
          <div className="w-16 h-16 bg-red-950 border border-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 animate-pulse">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white">Admin Security Access</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Enter the authorized security password to open the administration control panel.
          </p>

          {authError && (
            <div className="bg-red-950 border border-red-800 text-red-400 text-xs rounded-xl p-3 my-4">
              {authError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              placeholder="Enter Security Password..."
              value={adminPasswordInput}
              onChange={(e) => setAdminPasswordInput(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-white text-center tracking-widest text-sm"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white p-3.5 rounded-xl font-bold transition duration-200 cursor-pointer shadow-lg shadow-red-900/30"
            >
              Verify Security Key
            </button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="mt-6 text-gray-500 hover:text-gray-300 text-xs font-semibold cursor-pointer"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">
              Admin Control Panel
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage inventory, bookings, and monitor user activities in real-time from MongoDB.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 cursor-pointer shadow-md transition"
          >
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto gap-4">
          {!(user && user.name === "vinaykumar") && (
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`pb-4 px-2 font-bold text-sm border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-400 hover:text-slate-700"
              }`}
            >
              Stats Summary
            </button>
          )}
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`pb-4 px-2 font-bold text-sm border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === "vehicles"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-400 hover:text-slate-700"
            }`}
          >
            Vehicle Inventory ({vehicles.length})
          </button>
          {!(user && user.name === "vinaykumar") && (
            <>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`pb-4 px-2 font-bold text-sm border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === "bookings"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-400 hover:text-slate-700"
                }`}
              >
                Active Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab("logs")}
                className={`pb-4 px-2 font-bold text-sm border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === "logs"
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-400 hover:text-slate-700"
                }`}
              >
                User Activity Logs ({activities.length})
              </button>
            </>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            {/* TAB 1: SUMMARY DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
                    <p className="text-4xl font-extrabold text-slate-800">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Bookings</p>
                    <p className="text-4xl font-extrabold text-slate-800">{stats.totalBookings}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Vehicles</p>
                    <p className="text-4xl font-extrabold text-slate-800">{stats.totalVehicles}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Available Inventory</p>
                    <p className="text-4xl font-extrabold text-green-600">{stats.availableVehicles}</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-green-500 rounded-full opacity-10 blur-3xl"></div>
                  <h3 className="text-2xl font-bold mb-2">Real-Time Operations</h3>
                  <p className="text-gray-300 text-sm max-w-xl">
                    Every register, login, booking creation, cancel request, and payment is tracked using the
                    MongoDB activity logger. Navigate to the tabs to check records.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: VEHICLE MANAGEMENT */}
            {activeTab === "vehicles" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800">Vehicles Directory</h3>
                  <button
                    onClick={addVehicle}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-green-700 cursor-pointer transition"
                  >
                    Add New Vehicle
                  </button>
                </div>
                {vehicles.length === 0 ? (
                  <p className="text-center py-10 text-gray-500">No vehicles found in database.</p>
                ) : (
                  <AdminVehicleTable 
                    vehicles={vehicles} 
                    deleteVehicle={deleteVehicle} 
                    editVehicle={(vehicle) => setEditingVehicle(vehicle)} 
                  />
                )}
              </div>
            )}

            {/* TAB 3: BOOKINGS MANAGEMENT */}
            {activeTab === "bookings" && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-slate-800">Booking Records</h3>
                {bookings.length === 0 ? (
                  <p className="text-center py-10 text-gray-500">No bookings placed in the database yet.</p>
                ) : (
                  <div className="overflow-x-auto bg-white border rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b text-gray-700 font-bold text-sm">
                          <th className="p-4">Booking ID</th>
                          <th className="p-4">Customer Name</th>
                          <th className="p-4">Vehicle</th>
                          <th className="p-4">Pickup Date</th>
                          <th className="p-4">Return Date</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {bookings.map((b) => (
                          <tr key={b._id} className="border-b hover:bg-slate-50">
                            <td className="p-4 font-mono text-gray-400">{b._id}</td>
                            <td className="p-4 font-bold text-slate-800">
                              {b.userName || (b.user && b.user.name) || "N/A"}
                              <span className="block text-[10px] text-gray-400 font-normal">{b.user && b.user.email}</span>
                            </td>
                            <td className="p-4 font-medium text-slate-700">
                              {b.vehicleName || (b.vehicle ? b.vehicle.name : "Deleted Vehicle")}
                              <span className="block text-[10px] text-gray-400 font-normal">{b.vehicle && b.vehicle.brand}</span>
                            </td>
                            <td className="p-4 text-gray-500">{new Date(b.startDate).toLocaleDateString()}</td>
                            <td className="p-4 text-gray-500">{new Date(b.endDate).toLocaleDateString()}</td>
                            <td className="p-4 font-bold text-slate-800">₹{b.amount}</td>
                            <td className="p-4">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  b.status === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : b.status === "Cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: USER ACTIVITY LOGS */}
            {activeTab === "logs" && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">MongoDB User Activity Log</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    System-wide audit trail. Logs all user registers, logins, booking requests, cancels, and QR payments in MongoDB.
                  </p>
                </div>
                {activities.length === 0 ? (
                  <p className="text-center py-10 text-gray-500">No activity logs found in database.</p>
                ) : (
                  <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-sm max-h-[500px]">
                    <table className="w-full text-left border-collapse table-fixed">
                      <thead>
                        <tr className="bg-slate-100 border-b text-gray-700 font-bold text-xs sticky top-0">
                          <th className="p-3 w-1/4">Timestamp</th>
                          <th className="p-3 w-1/6">User</th>
                          <th className="p-3 w-1/6">Action</th>
                          <th className="p-3 w-5/12">Details</th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] font-medium text-slate-700">
                        {activities.map((act) => (
                          <tr key={act._id} className="border-b hover:bg-slate-50 transition">
                            <td className="p-3 text-gray-500 font-normal">{formatDate(act.createdAt)}</td>
                            <td className="p-3 font-semibold text-slate-800">
                              {act.username}
                              {act.email && <span className="block text-[9px] text-gray-400 font-normal truncate">{act.email}</span>}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  act.action === "REGISTER"
                                    ? "bg-blue-100 text-blue-800"
                                    : act.action === "LOGIN"
                                    ? "bg-purple-100 text-purple-800"
                                    : act.action === "CREATE_BOOKING"
                                    ? "bg-amber-100 text-amber-800"
                                    : act.action === "CANCEL_BOOKING"
                                    ? "bg-red-100 text-red-800"
                                    : act.action === "PAYMENT"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-slate-100 text-slate-800"
                                }`}
                              >
                                {act.action}
                              </span>
                            </td>
                            <td className="p-3 text-gray-600 truncate" title={act.details}>
                              {act.details}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {editingVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-extrabold text-slate-800 mb-6">Edit Vehicle</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Vehicle Name</label>
                  <input
                    type="text"
                    value={editingVehicle.name}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Brand</label>
                  <input
                    type="text"
                    value={editingVehicle.brand}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, brand: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Type</label>
                  <select
                    value={editingVehicle.type}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, type: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    required
                  >
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Price per Day (₹)</label>
                  <input
                    type="number"
                    value={editingVehicle.price}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, price: Number(e.target.value) })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Image Path</label>
                  <input
                    type="text"
                    value={editingVehicle.image}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, image: e.target.value })}
                    className="w-full border border-gray-300 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="edit-available"
                    checked={editingVehicle.available}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, available: e.target.checked })}
                    className="w-5 h-5 accent-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <label htmlFor="edit-available" className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Available for rent
                  </label>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingVehicle(null)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;