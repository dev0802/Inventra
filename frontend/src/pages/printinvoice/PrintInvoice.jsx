import React, { useState } from "react";

export default function PrintInvoice() {
  const [activeTab, setActiveTab] = useState("Customer Details");
  const [customerData, setCustomerData] = useState({
    customerName: "",
    birthday: "",
    anniversary: "",
    phone1Country: "+91",
    phone1: "",
    phone2Country: "+91",
    phone2: "",
    pinCode: "",
    vpo: "",
    district: "",
    state: "",
    email: "",
    gstin: "03ASRPS4951M1ZO",
    customerGstin: "",
  });

  // Rows state
  const [rows, setRows] = useState([
    { id: 1, itemCode: "", itemDescription: "", hsnCode: "", quantity: "", unit: "Gms.", rate: "", unitPrice: false, makingCharges: "" }
  ]);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      { id: prev.length + 1, itemCode: "", itemDescription: "", hsnCode: "", quantity: "", unit: "Gms.", rate: "", unitPrice: false, makingCharges: "" }
    ]);
  };

  const handleDeleteRow = (id) => {
    if (rows.length > 1) {
      setRows((prev) => prev.filter((row) => row.id !== id));
    }
  };

  const handleRowChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setCustomerData({
      customerName: "",
      birthday: "",
      anniversary: "",
      phone1Country: "+91",
      phone1: "",
      phone2Country: "+91",
      phone2: "",
      pinCode: "",
      vpo: "",
      district: "",
      state: "",
      email: "",
      gstin: "03ASRPS4951M1ZO",
      customerGstin: "",
    });
  };

  const countryCodes = [{ label: "India (+91)", value: "+91" }];

  const FloatingInput = ({ label, name, type = "text", value, onChange, required, maxLength }) => (
    <div className="relative mb-2">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder=" "
        className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
      />
      <label
        htmlFor={name}
        className="absolute left-3 -top-3.5
                  bg-gray-200 px-1
                  text-gray-700 text-md
                  transition-all
                  peer-placeholder-shown:text-base
                  peer-placeholder-shown:text-gray-600
                  peer-placeholder-shown:top-2
                  peer-focus:-top-3.5
                  peer-focus:text-md
                  peer-focus:text-gray-600"
      >
        {label}
        {required && <span className="text-gray-500 ml-0.5">*</span>}
      </label>
    </div>
  );

  return (
    <div className="w-full">
      <div className="bg-gray-200 shadow-lg shadow-gray-600 backdrop-blur-md border border-gray-400 rounded-2xl p-6 md:max-w-7xl mx-auto">
        
        {/* Toggle Switch */}
        <div className="flex flex-col items-center mb-7">
          <div className="relative w-2/3 h-10 bg-gray-100 rounded-full cursor-pointer flex items-center">
            <div
              className={`absolute w-1/2 h-full bg-gray-500 rounded-full transition-all duration-150
                ${activeTab === "Customer Details" ? "left-0" : "left-1/2"}`}
            />
            <span
              onClick={() => setActiveTab("Customer Details")}
              className={`z-10 w-1/2 text-center text-sm font-medium cursor-pointer transition-colors
                ${activeTab === "Customer Details" ? "text-white" : "text-gray-500"}`}
            >
              Customer Details
            </span>
            <span
              onClick={() => setActiveTab("Item Details")}
              className={`z-10 w-1/2 text-center text-sm font-medium cursor-pointer transition-colors
                ${activeTab === "Item Details" ? "text-white" : "text-gray-500"}`}
            >
              Add Item
            </span>
          </div>
        </div>

        {/* Item Details Tab */}
        {activeTab === "Item Details" && (
          <div key="item" className="flex flex-col gap-6">
            <div className="bg-white/50 rounded-xl shadow-md overflow-x-auto overflow-y-auto">
              <table className="w-full border-collapse text-sm min-w-[900px]">
                <thead>
                  <tr className="text-gray-600">
                    <th className="p-2 border border-gray-300 text-center">Item Code</th>
                    <th className="p-2 border border-gray-300 text-center">Item Description</th>
                    <th className="p-2 border border-gray-300 text-center">HSN Code</th>
                    <th className="p-2 border border-gray-300 text-center">Quantity</th>
                    <th className="p-2 border border-gray-300 text-center">Unit</th>
                    <th className="p-2 border border-gray-300 text-center">Rate</th>
                    <th className="p-2 border border-gray-300 text-center">Unit Price</th>
                    <th className="p-2 border border-gray-300 text-center">Making Charges (%)</th>
                    <th className="p-2 border border-gray-300 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="p-2 border border-gray-300 text-center">
                        <input
                          className="border rounded px-2 py-1 w-20 bg-white"
                          value={row.itemCode}
                          onChange={(e) => handleRowChange(row.id, "itemCode", e.target.value)}
                        />
                      </td>
                      <td className="p-2 border border-gray-300 text-center">
                        <input
                          className="border rounded px-2 py-1 w-44 bg-white"
                          value={row.itemDescription}
                          onChange={(e) => handleRowChange(row.id, "itemDescription", e.target.value)}
                        />
                      </td>
                      <td className="p-2 border border-gray-300 text-center">
                        <input
                          className="border rounded px-2 py-1 w-20 bg-white"
                          value={row.hsnCode}
                          onChange={(e) => handleRowChange(row.id, "hsnCode", e.target.value)}
                        />
                      </td>
                      <td className="p-2 border border-gray-300 text-center">
                        <input
                          className="border rounded px-2 py-1 w-20 bg-white"
                          value={row.quantity}
                          onChange={(e) => handleRowChange(row.id, "quantity", e.target.value)}
                        />
                      </td>
                      <td className="p-2 border border-gray-300 text-center">
                        <select
                          className="border rounded px-2 py-1 w-20 bg-white"
                          value={row.unit}
                          onChange={(e) => handleRowChange(row.id, "unit", e.target.value)}
                        >
                          <option>Gms.</option>
                          <option>Ct.</option>
                        </select>
                      </td>
                      <td className="p-2 border border-gray-300 text-center">
                        <input
                          className="border rounded px-2 py-1 w-20 bg-white"
                          value={row.rate}
                          onChange={(e) => handleRowChange(row.id, "rate", e.target.value)}
                        />
                      </td>
                      <td className="p-2 border border-gray-300 text-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 cursor-pointer accent-gray-600"
                          checked={row.unitPrice}
                          onChange={(e) => handleRowChange(row.id, "unitPrice", e.target.checked)}
                        />
                      </td>
                      <td className="p-2 border border-gray-300 text-center">
                        <input
                          className="border rounded px-2 py-1 w-24 bg-white"
                          value={row.makingCharges}
                          onChange={(e) => handleRowChange(row.id, "makingCharges", e.target.value)}
                        />
                      </td>
                      <td className="p-2 border border-gray-300 text-center">
                        <div className="flex gap-1 items-center justify-center">
                          {/* Plus button */}
                          <button
                            onClick={handleAddRow}
                            className="bg-transparent outline-none flex items-center justify-center text-gray-900 hover:text-gray-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </button>

                            <button
                              onClick={() => handleDeleteRow(row.id)}
                              className="text-red-700 p-1 hover:text-red-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="reset"
                onClick={handleReset}
                className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 transition-all duration-200"
              >
                Reset
              </button>
              <button
                type="submit"
                className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                Update Invoice
              </button>
              <button
                type="submit"
                className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                Submit Invoice
              </button>
            </div>
          </div>
        )}

        {/* Customer Details Tab */}
        {activeTab === "Customer Details" && (
          <div key="customer" className="flex flex-col gap-6">
            <FloatingInput label="Customer Name" name="customerName" value={customerData.customerName} onChange={handleChange} required />
            <FloatingInput label="Birthday" name="birthday" type="date" value={customerData.birthday} onChange={handleChange} required />
            <FloatingInput label="Anniversary" name="anniversary" type="date" value={customerData.anniversary} onChange={handleChange} />

            {/* Phone 1 */}
            <div className="relative mb-2">
              <div className="flex gap-2">
                <select name="phone1Country" value={customerData.phone1Country} onChange={handleChange} className="peer border border-gray-500 rounded-md px-2 py-2 bg-transparent focus:border-gray-500 focus:outline-none focus:shadow-md w-36">
                  {countryCodes.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <div className="relative flex-1">
                  <input type="tel" id="phone1" name="phone1" value={customerData.phone1} onChange={handleChange} maxLength="10" placeholder=" "
                    className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
                  />
                  <label htmlFor="phone1" className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-500 text-md transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600">
                    Phone 1<span className="text-gray-500 ml-0.5">*</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Phone 2 */}
            <div className="relative mb-2">
              <div className="flex gap-2">
                <select name="phone2Country" value={customerData.phone2Country} onChange={handleChange} className="peer border border-gray-500 rounded-md px-2 py-2 bg-transparent focus:border-gray-500 focus:outline-none focus:shadow-md w-36">
                  {countryCodes.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <div className="relative flex-1">
                  <input type="tel" id="phone2" name="phone2" value={customerData.phone2} onChange={handleChange} maxLength="10" placeholder=" "
                    className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
                  />
                  <label htmlFor="phone2" className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-500 text-md transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600">
                    Phone 2
                  </label>
                </div>
              </div>
            </div>

            {/* PIN Code, VPO, District, State */}
            <div className="grid grid-cols-4 gap-4">
              <FloatingInput label="PIN Code" name="pinCode" value={customerData.pinCode} onChange={handleChange} maxLength="6" />
              <FloatingInput label="VPO" name="vpo" value={customerData.vpo} onChange={handleChange} />
              <FloatingInput label="District" name="district" value={customerData.district} onChange={handleChange} />
              <FloatingInput label="State" name="state" value={customerData.state} onChange={handleChange} />
            </div>

            <FloatingInput label="Email" name="email" type="email" value={customerData.email} onChange={handleChange} />
            <FloatingInput label="Customer GSTIN" name="customerGstin" value={customerData.customerGstin} onChange={handleChange} />

            <div className="flex justify-center gap-3">
              <button type="reset" onClick={handleReset} className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 transition-all duration-200">
                Reset Details
              </button>
              <button type="submit" className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200">
                Update Customer Details
              </button>
              <button type="submit" className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200">
                Submit Customer Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}