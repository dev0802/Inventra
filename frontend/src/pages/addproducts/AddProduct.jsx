import React, { useEffect, useState } from "react";
import {
  addItemDescription,
  addProduct,
  getItemDescriptions,
  deleteItemDescription,
} from "../../services/productFeatureApi/addProductApi";
import NotificationModal from "../../shared/utilis/notificationModal";

export default function AddProduct() {
  const [showPopup, setShowPopup] = useState(false);
  const [newItemData, setNewItemData] = useState({
    itemDescription: "",
    goldPurity: "",
    silverPurity: "",
    diamondPurity: "",
  });
  
  const [itemDescriptions, setItemDescriptions] = useState([]);
  
  const [productData, setProductData] = useState({
    itemDescription: "",
    hsnCode: "7113",
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
    price: "",
    isSold: false,
    isDeleted: false,
  });

  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const showNotification = (type, title, message) => {
    setNotification({ isOpen: true, type, title, message });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  const handleAddItemDescription = async () => {
    if (newItemData.itemDescription.trim() === "") return;

    const goldPurityMap = {
      "14kt": "585",
      "18kt": "750",
      "22kt": "916",
      "24kt": "999",
    };

    let displayPurity = "";
    if (newItemData.goldPurity) {
      displayPurity = goldPurityMap[newItemData.goldPurity];
    } else if (newItemData.silverPurity) {
      displayPurity = newItemData.silverPurity;
    } else if (newItemData.diamondPurity) {
      displayPurity = newItemData.diamondPurity;
    }

    const showHallmark = newItemData.goldPurity && newItemData.goldPurity !== "24kt";

    const fullDescription = [
      newItemData.itemDescription.trim().toUpperCase(),
      displayPurity ? `(${displayPurity})` : "",
      showHallmark ? "HALLMARK" : "",
    ]
      .filter(Boolean)
      .join(" ");

    try {
      const response = await addItemDescription(fullDescription);
      const saved = response?.itemDescription ?? fullDescription;
      setItemDescriptions((prev) => [...prev, saved]);
      setProductData((prev) => ({ ...prev, itemDescription: saved }));
      setNewItemData({ itemDescription: "", goldPurity: "", silverPurity: "", diamondPurity: "" });
      setShowPopup(false);
      // showNotification("success", "Item Description Added", `"${saved}" has been added successfully.`);
    } catch (error) {
      console.error("Failed to add item description:", error);
      setItemDescriptions((prev) => [...prev, fullDescription]);
      setProductData((prev) => ({ ...prev, itemDescription: fullDescription }));
      setNewItemData({ itemDescription: "", goldPurity: "", silverPurity: "", diamondPurity: "" });
      setShowPopup(false);
      showNotification("error", "Add Failed", "Could not save to server, but item was added locally.");
    }
  };

  useEffect(() => {
    const fetchDescription = async () => {
      const response = await getItemDescriptions();
      setItemDescriptions(response.itemDescriptions ?? []);
    };
    fetchDescription();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");
    if (value.split(".").length > 2) {
      value = value.replace(/\.+$/, "");
    }

    const is2Decimal = ["diamondWeight", "solitaireWeight"].includes(e.target.name);
    const decimals = is2Decimal ? 2 : 3;

    if (value.includes(".")) {
      const parts = value.split(".");
      value = parts[0] + "." + parts[1].slice(0, decimals);
    }

    setProductData((prev) => {
      const updated = { ...prev, [e.target.name]: value };
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.itemDescription) {
      showNotification("error", "Validation Error", "Please select an item description before submitting.");
      return;
    }
    if (!productData.grossWeight) {
      showNotification("error", "Validation Error", "Please enter the gross weight before submitting.");
      return;
    }

    try {
      const response = await addProduct(productData);
      
      if (response.message === "Product added successfully") {
        
        showNotification(
          "success",
          "Product Added Successfully",
          `${response.product?.item_description} has been added with \n Item Code: ${response.product?.item_code ?? "N/A"}`
        );
        handleReset();
      } else {
        showNotification("error", "Failed to Add", "Product could not be added. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showNotification("error", "Something Went Wrong", "An unexpected error occurred. Please try again.");
    }
  };

  const handleReset = () => {
    setProductData((prev)=>({
      itemDescription: prev.itemDescription,
      hsnCode: "7113",
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
      price: "",
      isSold: false,
      isDeleted: false,
    }));
  };

  const deleteItemDescriptions = async () => {
    if (!productData.itemDescription) return;

    try {
      await deleteItemDescription(productData.itemDescription);
      setItemDescriptions((prev) => prev.filter((item) => item !== productData.itemDescription));
      setProductData((prev) => ({ ...prev, itemDescription: "" }));
      showNotification("success", "Item Description Deleted", `"${productData.itemDescription}" has been removed.`);
    } catch (error) {
      console.error("Delete failed:", error);
      showNotification("error", "Delete Failed", "Could not delete item description. Please try again.");
    }
  };

  return (
    <div className="w-full">
      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      <div className="bg-gray-300 shadow-lg shadow-gray-600 backdrop-blur-md border border-gray-400 rounded-2xl p-6 md:max-w-7xl md:min-h-4xl mx-auto">
        <div className="flex flex-col gap-3">

          {/* Item Description */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-md font-medium w-44">Item Description</label>
            <select
              name="itemDescription"
              value={productData.itemDescription}
              onChange={handleChange}
              className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md appearance-none cursor-pointer"
            >
              <option value="">-- Select --</option>
              {itemDescriptions.map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>

            {/* Add new item description popup */}
            <div className="relative">
              <button
                onClick={() => setShowPopup(!showPopup)}
                className="bg-transparent outline-none flex items-center justify-center text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" width="29" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>

              {showPopup && (
                <div className="absolute left-0 top-12 z-10 bg-gray-300 border border-gray-400 rounded-2xl shadow-lg p-4 w-80">
                  <h3 className="text-gray-700 text-md font-bold mb-3">Item Description</h3>
                  <input
                    value={newItemData.itemDescription}
                    onChange={(e) => setNewItemData((prev) => ({ ...prev, itemDescription: e.target.value }))}
                    className="w-full px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md mb-3"
                    placeholder="Enter item description"
                  />
                  <select
                    value={newItemData.goldPurity}
                    onChange={(e) => setNewItemData((prev) => ({ ...prev, goldPurity: e.target.value, silverPurity: "", diamondPurity: "" }))}
                    className="w-full px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md mb-3"
                  >
                    <option value="">Gold Purity</option>
                    <option value="14kt">14kt</option>
                    <option value="18kt">18kt</option>
                    <option value="22kt">22kt</option>
                    <option value="24kt">24kt</option>
                  </select>
                  <select
                    value={newItemData.silverPurity}
                    onChange={(e) => setNewItemData((prev) => ({ ...prev, silverPurity: e.target.value, goldPurity: "", diamondPurity: "" }))}
                    className="w-full px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md mb-3"
                  >
                    <option value="">Silver Purity</option>
                    <option value="800">800</option>
                    <option value="925">925</option>
                    <option value="958">958</option>
                    <option value="999">999</option>
                  </select>
                  <select
                    value={newItemData.diamondPurity}
                    onChange={(e) => setNewItemData((prev) => ({ ...prev, diamondPurity: e.target.value, goldPurity: "", silverPurity: "" }))}
                    className="w-full px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md mb-3"
                  >
                    <option value="">Diamond Purity</option>
                    <option value="14kt">14kt</option>
                    <option value="18kt">18kt</option>
                  </select>
                  <button
                    onClick={handleAddItemDescription}
                    className="w-full text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:opacity-80 transition-all duration-200"
                  >
                    Add Item
                  </button>
                </div>
              )}
            </div>

            {/* Delete item description */}
            <button
              onClick={deleteItemDescriptions}
              className="text-red-700 p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* HSN Code */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-md font-medium w-44">HSN Code</label>
            <input name="hsnCode" value={productData.hsnCode} onChange={handleChange} className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md" />
          </div>

          {/* Gross Weight */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-md font-medium w-44">Gross Weight (Gms.)</label>
            <input name="grossWeight" value={productData.grossWeight} onChange={handleNumericChange} className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md" />
          </div>

          {/* Stone Weight */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-md font-medium w-44">Stone Weight (Gms.)</label>
            <input name="stoneWeight" value={productData.stoneWeight} onChange={handleNumericChange} className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md" />
          </div>

          {/* Moti Weight */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-md font-medium w-44">Moti Weight (Gms.)</label>
            <input name="motiWeight" value={productData.motiWeight} onChange={handleNumericChange} className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md" />
          </div>

          {/* Diamond Weight */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-md font-medium w-44">Diamond Weight (Ct.)</label>
            <input name="diamondWeight" value={productData.diamondWeight} onChange={handleNumericChange} className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md" />
          </div>

          {/* Solitaire Weight */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-md font-medium w-44">Solitaire Weight (Ct.)</label>
            <input name="solitaireWeight" value={productData.solitaireWeight} onChange={handleNumericChange} className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md" />
          </div>

          {/* Color Stone */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-md font-medium w-44">Color Stone (Gms.)</label>
            <input name="colorStone" value={productData.colorStone} onChange={handleNumericChange} className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md" />
          </div>

          {/* Minna */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-md font-medium w-44">Minna (Gms.)</label>
            <input name="minnaWeight" value={productData.minnaWeight} onChange={handleNumericChange} className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md" />
          </div>

          {/* Colouring */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-md font-medium w-44">Colouring (Gms.)</label>
            <input name="colouring" value={productData.colouring} onChange={handleNumericChange} className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md" />
          </div>

          {/* Net Weight */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-md font-medium w-44">Net Weight (Gms.)</label>
            <input name="netWeight" value={productData.netWeight} onChange={handleNumericChange} className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md" />
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 text-md font-medium w-44">Price (₹)</label>
            <input name="price" value={productData.price || ""} onChange={handleNumericChange} className="flex-1 px-4 py-2 rounded-full border border-gray-400 bg-white/50 outline-none focus:border-gray-400 focus:shadow-md" />
          </div>

          <div className="mt-2 flex justify-end">
            <button
              type="reset"
              onClick={handleReset}
              className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 transition-all duration-200"
            >
              Reset
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 ml-3"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}