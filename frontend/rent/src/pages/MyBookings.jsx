import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [scanningBookingId, setScanningBookingId] = useState(null);
  const [processingBookingId, setProcessingBookingId] = useState(null);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 150);
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  };

  const simulateScanAndPay = async (bookingId) => {
    setScanningBookingId(bookingId);
    setTimeout(async () => {
      playBeep();
      setScanningBookingId(null);
      setProcessingBookingId(bookingId);

      try {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/pay`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Payment processing failed");
        }

        alert("Payment Successful! Booking status updated in database.");
        fetchBookings();
      } catch (err) {
        alert(err.message);
      } finally {
        setProcessingBookingId(null);
      }
    }, 1500);
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      // Filter out Cancelled and Completed for the active page, show only Booked & Paid
      const activeBookings = data.filter(
        (b) => b.status === "Booked" || b.status === "Paid"
      );
      setBookings(activeBookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!token) {
        navigate("/login");
      } else {
        fetchBookings();
      }
    }
  }, [token, authLoading]);

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      alert("Booking Cancelled!");
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800">
              Active Bookings
            </h1>
            <Link
              to="/scanner"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition duration-200"
            >
              Open QR Pay Scanner
            </Link>
          </div>

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
              <h2 className="text-xl font-semibold text-gray-500 mb-2">No Active Bookings Found</h2>
              <p className="text-gray-400 mb-6">Need a ride? Go to Home to book a car or bike!</p>
              <Link to="/" className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold">
                Book Now
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {bookings.map((booking) => {
                const qrData = `vehicle-rent:pay:${booking._id}:${booking.amount}`;
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

                return (
                  <div
                    key={booking._id}
                    className="bg-white border border-gray-150 rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs text-gray-400 font-medium">Booking ID: {booking._id}</span>
                          <h2 className="text-2xl font-bold text-slate-800 mt-0.5">
                            {booking.vehicleName || (booking.vehicle ? booking.vehicle.name : "Deleted Vehicle")}
                          </h2>
                          <span className="text-sm text-gray-500 font-medium capitalize">
                            {booking.vehicle ? `${booking.vehicle.brand} (${booking.vehicle.type})` : ""}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                            booking.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800 animate-pulse"
                          }`}
                        >
                          {booking.status === "Paid" ? "Paid" : "Pending Payment"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-b py-4 my-4 border-gray-100 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs">PICKUP DATE</p>
                          <p className="font-semibold text-gray-700">{formatDate(booking.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">RETURN DATE</p>
                          <p className="font-semibold text-gray-700">{formatDate(booking.endDate)}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 font-medium">Total Price</span>
                        <span className="text-2xl font-black text-green-600">₹{booking.amount}</span>
                      </div>
                    </div>

                    {booking.status !== "Paid" && (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                        <div className="text-center sm:text-left flex-1">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Scan QR / Pay Now
                          </h4>
                          
                          {scanningBookingId === booking._id ? (
                            <div className="relative w-28 h-28 mx-auto sm:mx-0 border-2 border-slate-700 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden my-2">
                              <div className="absolute left-0 w-full h-0.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-scannerLine"></div>
                              <span className="text-[10px] text-green-400 font-bold animate-pulse">Scanning...</span>
                            </div>
                          ) : processingBookingId === booking._id ? (
                            <div className="text-xs text-green-600 font-semibold my-3 flex items-center justify-center sm:justify-start gap-1.5">
                              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                              Processing Payment...
                            </div>
                          ) : (
                            <>
                              <p className="text-xs text-gray-400 max-w-[200px]">
                                Scan this UPI QR code using your app or use our simulated scanner to pay instantly.
                              </p>
                              <div className="mt-3 flex gap-2 justify-center sm:justify-start">
                                <button
                                  onClick={() => simulateScanAndPay(booking._id)}
                                  className="text-xs bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-slate-700 transition cursor-pointer"
                                >
                                  Simulate Pay (Scan Now)
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center">
                          <img
                            src={qrCodeUrl}
                            alt="Payment QR Code"
                            className="w-[120px] h-[120px]"
                            title="UPI Payment QR Code"
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex gap-4">
                      {booking.status !== "Paid" && (
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold py-2.5 rounded-xl text-center text-sm cursor-pointer transition"
                        >
                          Cancel Booking
                        </button>
                      )}
                      {booking.status === "Paid" && (
                        <div className="w-full py-2.5 text-center text-green-700 bg-green-50 border border-green-200 rounded-xl text-sm font-bold flex justify-center items-center gap-1.5">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          Payment Completed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;