import React, { useEffect, useState } from "react";
import {
  updateProductDetails,
  filterProducts,
  getAllProducts,
} from "../../services/api/viewproduct/viewProductApi";
import html2canvas from "html2canvas";
import { pdf } from "@react-pdf/renderer";
import ProductListPdf from "../../shared/component/ProductListPdf";
import JewelleryLabel from "../../shared/utilis/jewelleryLabel";
import NotificationModal from "../../shared/utilis/notificationModal";

export default function ViewProduct() {
  const [showFilter, setShowFilter] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [loadProducts, setLoadProducts] = useState([]);
  const [description, setDescription] = useState([]);

  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  const todayDate = new Date().toISOString().split("T")[0];

  const [selectedIds, setSelectedIds] = useState([]);
  const [labelPopup, setLabelPopup] = useState(false);

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
    startDate: todayDate,
    endDate: todayDate,
    itemDescription: "",
    itemCode: "",
    viewBy: "All",
  });

  const showNotification = (type, title, message) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  const toggleSelect = (id) => {
    setSelectedIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((x) => x !== id)
          : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === loadProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(loadProducts.map((p) => p.product_id));
    }
  };

  const selectedProducts = loadProducts.filter((p) =>
    selectedIds.includes(p.product_id),
  );

  const handlePrintLabels = async () => {
    const printArea = document.getElementById("labels-print-area");
    if (!printArea) return;

    const canvas = await html2canvas(printArea, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Labels</title>
        <style>
          @page {
            size: ${imgWidth / 2}px ${imgHeight / 2}px;
            margin: 0;
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            margin: 0;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          img {
            width: ${imgWidth / 2}px;
            height: ${imgHeight / 2}px;
            display: block;
          }
        </style>
      </head>
      <body>
        <img src="${imgData}" />
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          };
        </script>
      </body>
    </html>
  `);
  };

  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({
      startDate: todayDate,
      endDate: todayDate,
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
          p.product_id === product.product_id ? { ...p, is_deleted: true } : p,
        ),
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleApply = async () => {
    const appliedFilters = await filterProducts(filters);
    setLoadProducts(appliedFilters);
    setShowFilter(false);
  };

  useEffect(() => {
    const loadTodayProducts = async () => {
      try {
        const todayDate = new Date().toISOString().split("T")[0];
        const appliedFilters = await filterProducts({
          startDate: todayDate,
          endDate: todayDate,
          itemDescription: "",
          itemCode: "",
          viewBy: "All",
        });
        setLoadProducts(appliedFilters);
        const { descriptions } = await getAllProducts();
        setDescription(descriptions);
      } catch (error) {
        console.error("Load failed:", error);
      }
    };

    loadTodayProducts();
  }, []);

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
      await updateProductDetails(updateData);
      const updatedProducts = await filterProducts(filters);
      setLoadProducts(updatedProducts);
      setUpdatePopup(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getPdfFileDateTime = () => {
    const today = new Date();
    const date = today.toLocaleDateString("en-GB").replace(/\//g, "-");

    const time = today
      .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      .replace(":", "-");
    return `${date}_${time}`;
  };

  const handlePrintToPdf = async () => {
    try {
      const blob = await pdf(
        <ProductListPdf loadProducts={loadProducts} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Mana_Jewellers_Product_List_${getPdfFileDateTime()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
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
    <div className="p-1">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
      <div className="flex-1 bg-gray-300 shadow-lg shadow-gray-600 border border-gray-400 rounded-2xl w-full p-3 sm:p-4 md:p-6">
        <div className="flex-1">
          {/* Filter Button */}

          {/* ── Table ───────────────────────────────────────────────────────── */}
          <div className="bg-white/50 rounded-xl overflow-x-auto overflow-y-auto max-h-[70vh]">
            <table className="w-full border-collapse text-sm min-w-[1400px]">
              <thead className="sticky top-0 z-999 bg-gray-200">
                <tr>
                  {/* Select All checkbox */}
                  <th className="border border-gray-300 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={
                        loadProducts.length > 0 &&
                        selectedIds.length === loadProducts.length
                      }
                      onChange={toggleAll}
                    />
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
                  <th className="text-center  border-none bg-gray-300">
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
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadProducts.map((product) => (
                  <tr
                    key={product.product_id}
                    className={`${product.is_deleted ? "bg-red-50 pointer-events-none select-none" : "bg-gray-200"}`}
                  >
                    {/* Per-row checkbox */}
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.product_id)}
                        onChange={() => toggleSelect(product.product_id)}
                      />
                    </td>
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
                        className={`font-bold text-base ${product.is_sold ? "text-green-600" : "text-red-600"}`}
                      >
                        {product.is_sold ? "✓" : "✕"}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <span
                        className={`font-bold text-base ${product.is_deleted ? "text-green-600" : "text-red-600"}`}
                      >
                        {product.is_deleted ? "✓" : "✕"}
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
                    <td className="text-center border-none bg-gray-300"></td>
                  </tr>
                ))}

                {/* Totals Row */}
                <tr className="sticky bottom-0 bg-gray-200 border border-gray-300 px-3 py-2">
                  <td className="border border-gray-300 px-3 py-2"></td>
                  <td className="border border-gray-300 px-3 py-2"></td>
                  <td className="border border-gray-300 px-3 py-2 font-bold text-gray-800">
                    Total Quantity: {loadProducts.length}
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
                  <td className="text-center border-none bg-gray-300"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Bottom Buttons ─────────────────────────────────────────────────── */}
        <div className="w-full mt-5 flex justify-center gap-3">
          <button
            onClick={handlePrintToPdf}
            className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
          >
            Print to PDF
          </button>

          {/* Print Label — selected items ka label popup kholega */}
          <button
            onClick={() => {
              if (selectedIds.length === 0) {
                showNotification(
                  "error",
                  "No Items Selected",
                  "Please select at least one item to print its label.",
                );
                return;
              }
              setLabelPopup(true);
            }}
            className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
          >
            Print Label {selectedIds.length > 0 && `(${selectedIds.length})`}
          </button>
        </div>

        {/* ── Label Preview Popup ────────────────────────────────────────────── */}
        {labelPopup && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-5 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-700">
                  Label Preview — {selectedProducts.length} item
                  {selectedProducts.length > 1 ? "s" : ""}
                </h2>
                <button
                  onClick={() => setLabelPopup(false)}
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

              {/*
                labels-print-area — yeh div ka innerHTML print window mein jaata hai.
                Har JewelleryLabel component yahan render hoga.
                Barcode SVG already draw ho chuka hoga React ke through.
              */}
              <div
                id="labels-print-area"
                className="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-xl"
              >
                {selectedProducts.map((product) => (
                  <JewelleryLabel
                    key={product.product_id}
                    itemDescription={product.item_description}
                    grossWeight={parseFloat(product.gross_weight) || 0}
                    stoneWeight={parseFloat(product.stone_weight) || 0}
                    motiWeight={parseFloat(product.moti_weight) || 0}
                    diamondWeight={parseFloat(product.diamond_weight) || 0}
                    solitaireWeight={parseFloat(product.solitaire_weight) || 0}
                    colorStone={parseFloat(product.color_stone) || 0}
                    minnaWeight={parseFloat(product.minna_weight) || 0}
                    colouring={parseFloat(product.colouring) || 0}
                    netWeight={parseFloat(product.net_weight) || 0}
                    itemCode={String(product.item_code)}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setLabelPopup(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrintLabels}
                  className="flex-1 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition font-medium text-sm"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        )}

        {/*Update Popup*/}
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-md text-gray-500 mb-1 block">
                      Item Code
                    </label>
                    <input
                      type="text"
                      value={updateData.itemCode}
                      readOnly
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
                        className={`flex-1 text-md py-2 rounded-lg border transition font-medium ${filters.viewBy === opt ? "bg-gray-700 text-white border-gray-700" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}
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
