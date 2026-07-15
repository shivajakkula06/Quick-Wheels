import { useState, useEffect } from "react";
import localVehicles from "../data/Vehicles";
import VehicleCard from "../components/VehicleCard";
import SearchBar from "../components/SearchBar";

function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vehicles");
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        const data = await response.json();

        // Map database pricing/ID fields to keep compatibility with existing components
        const mappedData = data.map((v) => ({
          id: v._id,
          name: v.name,
          brand: v.brand,
          type: v.type,
          price: v.pricePerDay,
          image: v.image,
          available: v.available
        }));

        setVehicles(mappedData);
        setBackendStatus("connected");
      } catch (err) {
        console.warn("Backend unavailable, falling back to static vehicles:", err.message);
        setVehicles(localVehicles);
        setBackendStatus("fallback");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Filter vehicles
  const filteredVehicles =
    selectedType === "All"
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.type === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn">

        {/* Status Indicator */}
        <div className="flex justify-end mb-4">
          {backendStatus === "connected" ? (
            <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Connected to MongoDB
            </span>
          ) : backendStatus === "fallback" ? (
            <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Offline Mode (Static Data)
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              Checking Server...
            </span>
          )}
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b pb-8">
          <div className="flex-1">
            <h1 className="text-5xl font-bold">
              Rent Cars &
              <span className="text-green-600"> Bikes</span>
            </h1>

            <p className="mt-5 text-gray-600 text-lg">
              Choose from a wide range of cars and bikes.
              Book your favourite vehicle safely and at affordable prices.
            </p>

            {/* Location Information */}
            <div className="mt-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 w-fit shadow-sm">
              <div className="p-2 bg-green-600 rounded-xl text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-green-700 font-extrabold">Vehicle Available Location</p>
                <p className="text-slate-800 font-bold text-base">Yamnampet, Ghatkesar</p>
              </div>
            </div>

            <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 hover:scale-105 transition duration-300 shadow-lg cursor-pointer">
              Explore Vehicles
            </button>
          </div>

          <div className="flex-1 flex justify-center mt-8 md:mt-0">
            <img
              src="/hero.png"
              alt="Hero"
              className="w-[500px] hover:scale-105 transition duration-500"
              onError={(e) => {
                // Fallback icon if image doesn't exist
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>

        {/* Filter */}
        <div className="my-10 flex justify-center">
          <div className="bg-green-50 rounded-2xl shadow-md p-6 w-full md:w-96">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Filter Vehicles
            </h2>

            <SearchBar
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />
          </div>
        </div>

        {/* Available Vehicles */}
        <div>
          <h2 className="text-3xl font-bold mb-8">
            Available Vehicles
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading vehicles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="transform hover:-translate-y-3 hover:shadow-2xl transition duration-300"
                  >
                    <VehicleCard vehicle={vehicle} />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-4 py-12">
                  No vehicles found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;