import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function BookingForm({ vehicle }) {
  const [pickup, setPickup] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);

  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const calculateTotalAmount = () => {
    if (pickup && returnDate) {
      const pick = new Date(pickup);
      const ret = new Date(returnDate);
      const timeDiff = ret.getTime() - pick.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff > 0) {
        return daysDiff * vehicle.price;
      } else if (daysDiff === 0) {
        return vehicle.price; // Same day booking charged as 1 day
      }
    }
    return 0;
  };

  const totalAmount = calculateTotalAmount();

  const handleBooking = async () => {
    if (!user || !token) {
      alert("Please login to book a vehicle.");
      navigate("/login");
      return;
    }

    if (!pickup || !returnDate) {
      alert("Please select pickup and return dates.");
      return;
    }

    if (new Date(returnDate) < new Date(pickup)) {
      alert("Return date cannot be earlier than pickup date.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://quick-wheels-oua9.onrender.com/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vehicleId: vehicle.id,
            startDate: pickup,
            endDate: returnDate,
            amount: totalAmount,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      alert(
        "Booking Confirmed! Please proceed to scan and pay on the next screen.",
      );
      navigate("/my-bookings");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <img
        src={vehicle.image}
        alt={vehicle.name}
        className="w-64 h-40 object-contain mx-auto"
      />

      <h2 className="text-3xl font-bold text-center mt-4 text-slate-800">
        {vehicle.name}
      </h2>

      <p className="text-center text-green-600 text-xl font-bold mt-1">
        ₹{vehicle.price}/day
      </p>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-slate-700">
          Pickup Date
        </label>
        <input
          type="date"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="border w-full rounded-xl p-3 mt-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-semibold text-slate-700">
          Return Date
        </label>
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          className="border w-full rounded-xl p-3 mt-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {totalAmount > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 animate-fadeIn">
          <p className="text-lg font-bold text-green-800 text-center">
            Total Amount: ₹{totalAmount}
          </p>
          <p className="text-xs text-red-600 mt-2 text-center font-medium">
            * Note: If you fail to return the vehicle on the scheduled date, an
            extra charge of 10% per hour will be applied.
          </p>
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={loading}
        className={`w-full bg-green-600 text-white py-3.5 rounded-xl mt-6 font-bold shadow-lg hover:bg-green-700 transition duration-200 cursor-pointer ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Confirming Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
}

export default BookingForm;
