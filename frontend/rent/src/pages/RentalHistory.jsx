import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function RentalHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch booking history");
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!token) {
        navigate("/login");
      } else {
        fetchHistory();
      }
    }
  }, [token, authLoading]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn">
        <div className="max-w-6xl mx-auto py-10 px-6">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-6">
            Rental History
          </h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-200">
              {error}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <h2 className="text-xl font-semibold text-gray-500">No History Available</h2>
              <p className="text-gray-400 mt-1">Your booking records will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white border border-gray-150 rounded-2xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-150 text-gray-700 font-bold border-b border-gray-200">
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Pickup Date</th>
                    <th className="p-4">Return Date</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-gray-800">
                        {booking.vehicle.name}
                        <span className="block text-xs font-normal text-gray-400">{booking.vehicle.brand}</span>
                      </td>
                      <td className="p-4 text-gray-600 font-medium">{formatDate(booking.startDate)}</td>
                      <td className="p-4 text-gray-600 font-medium">{formatDate(booking.endDate)}</td>
                      <td className="p-4 font-bold text-slate-800">₹{booking.amount}</td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                            booking.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : booking.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RentalHistory;