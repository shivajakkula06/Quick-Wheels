function AdminVehicleTable({ vehicles, deleteVehicle, editVehicle }) {
  return (
    <table className="w-full bg-white shadow rounded">

      <thead className="bg-gray-200">

        <tr>

          <th className="p-3">Image</th>
          <th>Name</th>
          <th>Type</th>
          <th>Price</th>
          <th>Action</th>

        </tr>

      </thead>

      <tbody>

        {vehicles.map((vehicle) => (

          <tr
            key={vehicle.id}
            className="text-center border-b"
          >

            <td className="p-2">
              <img
                src={vehicle.image}
                className="w-20 h-16 object-contain mx-auto"
              />
            </td>

            <td>{vehicle.name}</td>

            <td>{vehicle.type}</td>

            <td>₹{vehicle.price}</td>

            <td className="p-3 flex justify-center items-center gap-2">
              <button
                onClick={() => editVehicle(vehicle)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteVehicle(vehicle.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
              >
                Delete
              </button>
            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}

export default AdminVehicleTable;