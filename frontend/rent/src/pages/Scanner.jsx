import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Scanner() {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Load bookings that are unpaid ("Booked" status)
  useEffect(() => {
    const fetchUnpaidBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        const unpaid = data.filter((b) => b.status === "Booked");
        setBookings(unpaid);

        // Pre-select if passed in navigation state
        if (location.state && location.state.bookingId) {
          const matched = unpaid.find((b) => b._id === location.state.bookingId);
          if (matched) {
            setSelectedBookingId(matched._id);
          } else if (unpaid.length > 0) {
            setSelectedBookingId(unpaid[0]._id);
          }
        } else if (unpaid.length > 0) {
          setSelectedBookingId(unpaid[0]._id);
        }
      } catch (err) {
        setError("Error loading active bookings.");
      }
    };

    if (token) {
      fetchUnpaidBookings();
    }
  }, [token, location.state]);

  // Self-contained beep sound generator using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note (high beep)
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 150);
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by browser:", e);
    }
  };

  const handleSimulateScan = () => {
    if (!selectedBookingId) {
      setError("Please select an active booking to scan.");
      return;
    }

    const booking = bookings.find((b) => b._id === selectedBookingId);
    if (!booking) return;

    setError("");
    setScanning(true);
    setScanResult(null);

    // Simulate camera scanning duration
    setTimeout(() => {
      setScanning(false);
      playBeep();
      setScanResult({
        bookingId: booking._id,
        vehicleName: booking.vehicleName || (booking.vehicle ? booking.vehicle.name : "Deleted Vehicle"),
        brand: booking.vehicle ? booking.vehicle.brand : "N/A",
        amount: booking.amount,
        userName: booking.userName,
        rawCode: `vehicle-rent:pay:${booking._id}:${booking.amount}`,
      });
    }, 2000);
  };

  const handleProcessPayment = async () => {
    if (!scanResult) return;

    setProcessing(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${scanResult.bookingId}/pay`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment processing failed");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/my-bookings");
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-slate-800 text-center mb-2">
          QR Payment Scanner
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm max-w-lg mx-auto">
          Scan the booking QR code to complete your payment instantly. Select a booking from the simulator or use a webcam scan.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Viewfinder / Scanner Animation */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-72 h-72 rounded-3xl border-4 border-slate-700 bg-slate-900 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
              
              {/* Camera Corners overlay */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-green-500 rounded-tl"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-green-500 rounded-tr"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-green-500 rounded-bl"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-green-500 rounded-br"></div>

              {/* Scanning laser line */}
              {scanning && (
                <div className="absolute left-0 w-full h-1 bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-scannerLine"></div>
              )}

              {success ? (
                <div className="text-center animate-bounce text-green-500 z-10 flex flex-col items-center">
                  <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-bold text-sm text-white">Payment Success!</span>
                </div>
              ) : scanning ? (
                <div className="text-center text-white z-10">
                  <p className="text-xs tracking-widest text-green-400 uppercase animate-pulse font-bold">Scanning...</p>
                  <p className="text-[10px] text-gray-400 mt-1">Align QR Code in Frame</p>
                </div>
              ) : scanResult ? (
                <div className="text-center text-green-400 z-10 p-4">
                  <svg className="w-12 h-12 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h.01M5.938 9.5a7.5 7.5 0 1112.124 0H5.938z" />
                  </svg>
                  <p className="text-xs font-bold uppercase tracking-wider">QR Code Read</p>
                  <p className="text-[10px] text-white mt-1 font-mono truncate max-w-[200px] mx-auto">{scanResult.rawCode}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500 p-6 z-10 flex flex-col items-center">
                  <svg className="w-12 h-12 mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h.01M5.938 9.5a7.5 7.5 0 1112.124 0H5.938z" />
                  </svg>
                  <p className="text-xs font-semibold">Scanner Standby</p>
                  <p className="text-[10px] mt-1 text-gray-500">Select booking and click Scan</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Control Panel & Decoded Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              Scanner Control Panel
            </h3>

            {success ? (
              <div className="text-center py-6">
                <h4 className="text-xl font-bold text-green-700 mb-2">🎉 Thank You!</h4>
                <p className="text-sm text-gray-500">
                  Your booking has been paid successfully. Redirecting you back to active bookings...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Select Your Unpaid Booking
                  </label>
                  {bookings.length === 0 ? (
                    <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-lg border border-amber-200">
                      No unpaid bookings found in your database. Go book a vehicle first!
                    </div>
                  ) : (
                    <select
                      value={selectedBookingId}
                      onChange={(e) => {
                        setSelectedBookingId(e.target.value);
                        setScanResult(null);
                      }}
                      className="w-full border border-gray-300 p-3 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    >
                      {bookings.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.vehicleName || (b.vehicle ? b.vehicle.name : "Deleted Vehicle")} (Amount: ₹{b.amount})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSimulateScan}
                  disabled={scanning || bookings.length === 0}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer"
                >
                  {scanning ? "Reading QR Pattern..." : "Simulate QR Scan"}
                </button>

                {/* Decoded Output */}
                {scanResult && (
                  <div className="bg-white border border-green-200 rounded-xl p-4 mt-4 animate-slideDown shadow-sm">
                    <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider mb-2 border-b pb-1">
                      Decoded Payment Details
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <p><strong>Booking ID:</strong> <span className="font-mono text-[10px] text-gray-500">{scanResult.bookingId}</span></p>
                      <p><strong>Customer Name:</strong> {scanResult.userName}</p>
                      <p><strong>Vehicle:</strong> {scanResult.vehicleName} ({scanResult.brand})</p>
                      <p className="text-sm font-bold mt-1 text-slate-800">
                        <strong>Amount Due:</strong> <span className="text-green-600">₹{scanResult.amount}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleProcessPayment}
                      disabled={processing}
                      className="w-full bg-green-600 text-white font-bold text-sm py-3 rounded-xl mt-4 hover:bg-green-700 shadow-md transition disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
                    >
                      {processing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing Payment...
                        </>
                      ) : (
                        "Authorize Payment (Pay Now)"
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
