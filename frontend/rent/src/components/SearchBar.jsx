function SearchBar({ selectedType, setSelectedType }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 mt-10">

      <h2 className="text-2xl font-bold text-center mb-5">
        Filter Vehicles
      </h2>

      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="All">All Vehicles</option>
        <option value="Car">Cars</option>
        <option value="Bike">Bikes</option>
      </select>

    </div>
  );
}

export default SearchBar;