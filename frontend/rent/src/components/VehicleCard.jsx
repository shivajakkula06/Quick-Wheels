import { useNavigate } from "react-router-dom";

function VehicleCard({ vehicle }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-lg p-5">
      <img
        src={vehicle.image}
        alt={vehicle.name}
        className="w-full h-44 object-contain"
      />

      <h2 className="text-2xl font-bold mt-3">
        {vehicle.name}
      </h2>

      <p className="text-gray-600">
        {vehicle.type}
      </p>

      <p className="text-green-600 font-bold text-xl mt-2">
        ₹{vehicle.price}/day
      </p>

      <button
        onClick={() => navigate("/booking", { state: vehicle })}
        disabled={!vehicle.available}
        className={`mt-4 w-full py-2 rounded-lg font-bold transition duration-200 ${
          vehicle.available
            ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            : "bg-red-100 text-red-600 border border-red-200 cursor-not-allowed"
        }`}
      >
        {vehicle.available ? "Book Now" : "Booked / Unavailable"}
      </button>
    </div>
  );
}

export default VehicleCard;