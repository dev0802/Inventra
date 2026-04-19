import React, { useEffect, useState } from "react";
import {
  updateProductDetails,
  filterProducts,
  getAllProducts,
} from "../../services/api/viewproduct/viewProductApi";
export default function ViewProduct() {
  const [showFilter, setShowFilter] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [loadProducts, setLoadProducts] = useState([]);
  const [description, setDescription] = useState([]);
  const [updateData, setUpdateData] = useState({
    itemCode: "",
    itemDescription: "",
    grossWeight: "",
    stoneWeight: "",
    motiWeight: "",
    diamondWeight: "",
    solitaireWeight: "",
    colorStone: "",
    minnaWeight: "",
    netWeight: "",
    colouring: "",
    purchasedDate: "",
    saleDate: "",
    isSold: false,
    isDeleted: false,
  });

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    itemDescription: "",
    itemCode: "",
    viewBy: "All",
  });

  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      itemDescription: "",
      itemCode: "",
      viewBy: "All",
    });
  };

    const handleDelete = async (product) => {
      try {
        await updateProductDetails({
          itemCode: product.item_code,
          itemDescription: product.item_description,
          grossWeight: product.gross_weight,
          stoneWeight: product.stone_weight,
          motiWeight: product.moti_weight,
          diamondWeight: product.diamond_weight,
          solitaireWeight: product.solitaire_weight,
          colorStone: product.color_stone,
          minnaWeight: product.minna_weight,
          colouring: product.colouring,
          netWeight: product.net_weight,
          purchasedDate: product.purchased_date,
          saleDate: product.sale_date,
          isSold: product.is_sold,
          isDeleted: true,
        });
        setLoadProducts((prev) =>
            prev.map((p) =>
                p.product_id === product.product_id 
                    ? { ...p, is_deleted: true }
                    : p
            )
        );
      } catch (error) {
        console.error("Delete failed:", error);
      }
    };

  const handleApply = async () => {
    // API call here later
    const appliedFilters = await filterProducts(filters);
    setLoadProducts(appliedFilters);
    setShowFilter(false);
  };
  const handleLoadProduct = async () => {
    console.log("Button clicked!"); // ← sabse pehle yeh daalo
    const { products, descriptions } = await getAllProducts();
    setLoadProducts(products);
    setDescription(descriptions);
  };

  useEffect(() => {
    handleLoadProduct();
  }, []);
  // Yeh function banao
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const parts = dateStr.split("T")[0].split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;

    setUpdateData((prev) => {
      const updated = { ...prev, [name]: value };

      const netWeight =
        (parseFloat(updated.grossWeight) || 0) -
        ((parseFloat(updated.stoneWeight) || 0) +
          (parseFloat(updated.motiWeight) || 0) +
          (parseFloat(updated.diamondWeight) || 0) / 5 +
          (parseFloat(updated.solitaireWeight) || 0) / 5 +
          (parseFloat(updated.colorStone) || 0) +
          (parseFloat(updated.minnaWeight) || 0) +
          (parseFloat(updated.colouring) || 0));

      return {
        ...updated,
        netWeight: netWeight >= 0 ? parseFloat(netWeight.toFixed(3)) : 0,
      };
    });
  };
  const handleUpdate = (product) => {
    setUpdateData({
      itemCode: product.item_code,
      itemDescription: product.item_description,
      grossWeight: product.gross_weight,
      stoneWeight: product.stone_weight,
      motiWeight: product.moti_weight,
      diamondWeight: product.diamond_weight,
      solitaireWeight: product.solitaire_weight,
      colorStone: product.color_stone,
      minnaWeight: product.minna_weight,
      netWeight: product.net_weight,
      colouring: product.colouring,
      purchasedDate: product.purchased_date
        ? product.purchased_date.split("T")[0]
        : "",
      saleDate: product.sale_date ? product.sale_date.split("T")[0] : "",
      isSold: product.is_sold,
      isDeleted: product.is_deleted,
    });
    setUpdatePopup(true);
  };

  const handleDataUpdate = async () => {
    try {
      await updateProductDetails(updateData); // update karo
      await handleLoadProduct(); // fresh data load karo
      setUpdatePopup(false);
    } catch (error) {
      console.error(error);
    }
  };

  const totals = loadProducts.reduce(
    (acc, product) => ({
      netWeight: acc.netWeight + (parseFloat(product.net_weight) || 0),
      grossWeight: acc.grossWeight + (parseFloat(product.gross_weight) || 0),
      stoneWeight: acc.stoneWeight + (parseFloat(product.stone_weight) || 0),
      motiWeight: acc.motiWeight + (parseFloat(product.moti_weight) || 0),
      diamondWeight:
        acc.diamondWeight + (parseFloat(product.diamond_weight) || 0),
      solitaireWeight:
        acc.solitaireWeight + (parseFloat(product.solitaire_weight) || 0),
      colorStone: acc.colorStone + (parseFloat(product.color_stone) || 0),
      minnaWeight: acc.minnaWeight + (parseFloat(product.minna_weight) || 0),
      colouring: acc.colouring + (parseFloat(product.colouring) || 0),
    }),
    {
      netWeight: 0,
      grossWeight: 0,
      stoneWeight: 0,
      motiWeight: 0,
      diamondWeight: 0,
      solitaireWeight: 0,
      colorStone: 0,
      minnaWeight: 0,
      colouring: 0,
    },
  );

  return (
    <div className="h-screen p-1 ">
      <div className="flex-1 bg-gray-300 shadow-lg shadow-gray-600 border border-gray-400 rounded-2xl w-full p-3 sm:p-4 md:p-6">
        <div className="flex-1 bg-white/50 mt-4 rounded-lg p-6 shadow-md ">
          {/* Filter Button */}
          <div className="mb-5 flex justify-end gap-3">
            <button
              onClick={() => setShowFilter(true)}
              className="flex items-center gap-2 bg-white/50 hover:bg-white/70 text-gray-700 text-sm font-medium px-3 py-2 rounded-xl border border-gray-300 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                />
              </svg>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white/50 rounded-xl shadow-md overflow-y-scroll">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-3 py-2">
                    <input type="checkbox" />
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Item Code
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Name
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Purchase Date
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Sale Date
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-center whitespace-nowrap">
                    Sold
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-center whitespace-nowrap">
                    Deleted
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Net Weight
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Gross Wt
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Stone Wt
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Moti Wt
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Diamond Wt
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Solitaire Wt
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Color Stone
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Minna
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-left whitespace-nowrap">
                    Colouring
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-center whitespace-nowrap">
                    Delete Item
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-gray-600 font-bold text-center whitespace-nowrap">
                    Update Item
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadProducts.map((product) => (
                  <tr key={product.product_id}>
                    <th className="border border-gray-300 px-3 py-2">
                      <input type="checkbox" />
                    </th>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 font-medium">
                      {product.item_code}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800 font-semibold whitespace-nowrap">
                      {product.item_description}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800">
                      {formatDate(product.purchased_date)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800">
                      {formatDate(product.sale_date)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <span
                        className={`font-bold text-base ${product.is_sold === true ? "text-green-600" : "text-red-600"}`}
                      >
                        {product.is_sold === true ? "✓" : "✕"}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <span
                        className={`font-bold text-base ${product.is_deleted === true ? "text-green-600" : "text-red-600"}`}
                      >
                        {product.is_deleted === true ? "✓" : "✕"}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800">
                      {product.net_weight}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800">
                      {product.gross_weight}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800">
                      {product.stone_weight}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800">
                      {product.moti_weight}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800">
                      {product.diamond_weight}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800">
                      {product.solitaire_weight}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800">
                      {product.color_stone}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800">
                      {product.minna_weight}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800">
                      {product.colouring}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <button
                        onClick={() => handleDelete(product)}
                        className="bg-white hover:bg-red-100 text-gray-700 hover:text-red-700 text-sm font-medium px-3 py-1 rounded border border-gray-300 hover:border-red-300 transition"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <button
                        onClick={() => handleUpdate(product)}
                        className="bg-white hover:bg-blue-100 text-gray-700 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded border border-gray-300 hover:border-blue-300 transition"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr>
                  <td className="border border-gray-300 px-3 py-2"></td>
                  <td className="border border-gray-300 px-3 py-2"></td>
                  <td
                    className="border border-gray-300 px-3 py-2 font-bold text-gray-800"
                    colSpan={1}
                  >
                    Total Quantity : {loadProducts.length}
                  </td>
                  <td className="border border-gray-300 px-3 py-2"></td>
                  <td className="border border-gray-300 px-3 py-2"></td>
                  <td className="border border-gray-300 px-3 py-2"></td>
                  <td className="border border-gray-300 px-3 py-2"></td>
                  <td className="border border-gray-300 px-3 py-2 font-bold text-gray-800">
                    {totals.netWeight.toFixed(3)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 font-bold text-gray-800">
                    {totals.grossWeight.toFixed(3)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 font-bold text-gray-800">
                    {totals.stoneWeight.toFixed(3)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 font-bold text-gray-800">
                    {totals.motiWeight.toFixed(3)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 font-bold text-gray-800">
                    {totals.diamondWeight.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 font-bold text-gray-800">
                    {totals.solitaireWeight.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 font-bold text-gray-800">
                    {totals.colorStone.toFixed(3)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 font-bold text-gray-800">
                    {totals.minnaWeight.toFixed(3)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 font-bold text-gray-800">
                    {totals.colouring.toFixed(3)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2"></td>
                  <td className="border border-gray-300 px-3 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full mt-5 flex justify-center gap-3">
          <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">
            Print to pdf
          </button>
          <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">
            Print label
          </button>
        </div>

        {/* Update Popup */}
        {updatePopup && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-700">
                  Update Item
                </h2>
                <button
                  onClick={() => setUpdatePopup(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Row 1 - Code aur Description */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Item Code
                    </label>
                    <input
                      type="text"
                      value={updateData.itemCode}
                      readOnly
                      placeholder="e.g. 5"
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Item Description
                    </label>
                    <input
                      type="text"
                      name="itemDescription"
                      value={updateData.itemDescription}
                      onChange={handleUpdateChange}
                      placeholder="e.g. BABY RING"
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                {/* Row 2 - Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      name="purchasedDate"
                      value={updateData.purchasedDate}
                      onChange={handleUpdateChange}
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Sale Date
                    </label>
                    <input
                      type="date"
                      name="saleDate"
                      value={updateData.saleDate}
                      onChange={handleUpdateChange}
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                {/* Row 3 - Weights */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Net Weight
                    </label>
                    <input
                      type="number"
                      name="netWeight"
                      value={updateData.netWeight}
                      readOnly
                      placeholder="0.000"
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Gross Weight
                    </label>
                    <input
                      type="number"
                      name="grossWeight"
                      value={updateData.grossWeight}
                      onChange={handleUpdateChange}
                      placeholder="0.000"
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Stone Weight
                    </label>
                    <input
                      type="number"
                      name="stoneWeight"
                      value={updateData.stoneWeight}
                      onChange={handleUpdateChange}
                      placeholder="0.000"
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                {/* Row 4 - More Weights */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Moti Weight
                    </label>
                    <input
                      type="number"
                      name="motiWeight"
                      value={updateData.motiWeight}
                      onChange={handleUpdateChange}
                      placeholder="0.000"
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Diamond Weight
                    </label>
                    <input
                      type="number"
                      name="diamondWeight"
                      value={updateData.diamondWeight}
                      onChange={handleUpdateChange}
                      placeholder="0.000"
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Solitaire Weight
                    </label>
                    <input
                      type="number"
                      name="solitaireWeight"
                      value={updateData.solitaireWeight}
                      onChange={handleUpdateChange}
                      placeholder="0.000"
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                {/* Row 5 - Remaining */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Color Stone
                    </label>
                    <input
                      type="number"
                      name="colorStone"
                      value={updateData.colorStone}
                      onChange={handleUpdateChange}
                      placeholder="0.000"
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Minna Weight
                    </label>
                    <input
                      type="number"
                      name="minnaWeight"
                      value={updateData.minnaWeight}
                      onChange={handleUpdateChange}
                      placeholder="0.000"
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Colouring
                    </label>
                    <input
                      type="number"
                      name="colouring"
                      value={updateData.colouring}
                      onChange={handleUpdateChange}
                      placeholder="0.000"
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                {/* Row 6 - Toggles */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                    <label className="text-md text-gray-500">Is Sold?</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setUpdateData({ ...updateData, isSold: true })
                        }
                        className={`text-md px-3 py-1 rounded border transition ${updateData.isSold ? "bg-gray-700 text-white" : "bg-white text-gray-500 border-gray-200"}`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() =>
                          setUpdateData({ ...updateData, isSold: false })
                        }
                        className={`text-md px-3 py-1 rounded border transition ${!updateData.isSold ? "bg-gray-700 text-white" : "bg-white text-gray-500 border-gray-200"}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                    <label className="text-md text-gray-500">Is Deleted?</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setUpdateData({ ...updateData, isDeleted: true })
                        }
                        className={`text-md px-3 py-1 rounded border transition ${updateData.isDeleted ? "bg-gray-700 text-white" : "bg-white text-gray-500 border-gray-200"}`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() =>
                          setUpdateData({ ...updateData, isDeleted: false })
                        }
                        className={`text-md px-3 py-1 rounded border transition ${!updateData.isDeleted ? "bg-gray-700 text-white" : "bg-white text-gray-500 border-gray-200"}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setUpdatePopup(false)}
                  className="flex-1 text-md py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDataUpdate}
                  className="flex-1 text-md py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition font-medium"
                >
                  Update Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Popup */}
        {showFilter && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-700">
                  Filter Products
                </h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleFilter}
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilter}
                      className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-md text-gray-500 mb-1 block">
                    Item Description
                  </label>
                  <select
                    name="itemDescription"
                    value={filters.itemDescription}
                    onChange={handleFilter}
                    className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                  >
                    <option value="">All Products</option>
                    {description.map((desc, i) => (
                      <option key={i} value={desc}>
                        {desc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-md text-gray-500 mb-1 block">
                    Item Code
                  </label>
                  <input
                    type="text"
                    name="itemCode"
                    value={filters.itemCode}
                    onChange={handleFilter}
                    placeholder="e.g. 5"
                    className="w-full text-md border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="text-md text-gray-500 mb-1 block">
                    View By
                  </label>
                  <div className="flex gap-2">
                    {["All", "Sold", "Unsold", "Deleted"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setFilters({ ...filters, viewBy: opt })}
                        className={`flex-1 text-md py-2 rounded-lg border transition font-medium
                                                ${
                                                  filters.viewBy === opt
                                                    ? "bg-gray-700 text-white border-gray-700"
                                                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                                                }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleReset}
                  className="flex-1 text-md py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 text-md py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
