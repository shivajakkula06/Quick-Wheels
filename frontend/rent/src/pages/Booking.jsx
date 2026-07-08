import { useLocation } from "react-router-dom";
import BookingForm from "../components/BookingForm";

function Booking() {

  const location = useLocation();

  const vehicle = location.state;

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-6">

    <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn">
      <h1 className="text-center text-3xl mt-20">
        No Vehicle Selected
      </h1>
      </div></div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-6">

    <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn">
    <div className="max-w-xl mx-auto py-10 px-6">
      <BookingForm vehicle={vehicle}/>
    </div></div></div>
  );
}

export default Booking;