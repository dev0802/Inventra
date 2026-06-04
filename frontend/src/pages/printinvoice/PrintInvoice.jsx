// import React, { useState, useEffect } from "react";
// import {
//   customerDetail,
//   getCustomerByPhone,
//   updateCustomerDetail,
//   getProductByItemCode,
//   saveItemDetail,
//   saveInvoice,
// } from "../../services/api/printinvoice/printInvoiceApi";
// import { getGoldRateByDateApi } from "../../services/api/goldrate/goldRateApi";
// import { pdf } from "@react-pdf/renderer";
// import InvoicePdf from "../../shared/component/InvoicePdf";
// import { useGoldRate } from "../../context/GoldRateContext";
// import NotificationModal from "../../shared/utilis/notificationModal";
// const karatOptions = [
//   { label: "24kt", value: "24K", key: "goldRate24K" },
//   { label: "22kt", value: "22K", key: "goldRate22K" },
//   { label: "18kt", value: "18K", key: "goldRate18K" },
//   { label: "14kt", value: "14K", key: "goldRate14K" },
// ];
// const todayDate = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   };
//   const customerData = {
//     customerName: "",
//     birthday: todayDate(),
//     anniversary: todayDate(),
//     phone1Country: "+91",
//     phone1: "",
//     phone2Country: "+91",
//     phone2: "",
//     pinCode: "",
//     vpo: "",
//     district: "",
//     state: "",
//     email: "",
//     gstin: "03ASRPS4951M1ZO",
//     customerGstin: "",
//   };

// export default function PrintInvoice() {
//   const [includeGST, setIncludeGST] = useState(true);

//   const goldRateData = useGoldRate();

//   const [selectedKarat, setSelectedKarat] = useState("24K");

//   const handleGoldRateByDecription = (description) => {
//     const desc = description.toLowerCase();
//     if (desc.includes("999")) return goldRateData?.goldRate24K || "";
//     if (desc.includes("916") || desc.includes("22"))
//       return goldRateData?.goldRate22K || "";
//     if (desc.includes("750") || desc.includes("18"))
//       return goldRateData?.goldRate18K || "";
//     if (desc.includes("585") || desc.includes("14"))
//       return goldRateData?.goldRate14K || "";
//   };

//   const [goldRateDate, setGoldRateDate] = useState(todayDate());

//   useEffect(() => {
//     const getSelectedRate = () => {
//       const karat = karatOptions.find((k) => k.value === selectedKarat);
//       return goldRateData?.[karat?.key] || "";
//     };

//     const rate = getSelectedRate();
//     setRows((prev) =>
//       prev.map((row) => (row.unitPrice ? { ...row, rate } : row)),
//     );
//   }, [selectedKarat, goldRateData]);

//   const handlePrintInvoice = async () => {
//     if (!customerData.customerName.trim())
//       return showNotification("error", "Error", "Customer Name is required!");
//     if (!customerData.phone1.trim() || customerData.phone1.length < 10)
//       return showNotification(
//         "error",
//         "Error",
//         "Valid Phone Number is required!",
//       );
//     if (!customerData.birthday)
//       return showNotification("error", "Error", "Birthday is required!");
//     if (!customerData.vpo.trim())
//       return showNotification("error", "Error", "VPO is required!");
//     if (!customerData.pinCode.trim())
//       return showNotification("error", "Error", "PIN Code is required!");
//     if (!customerData.state.trim())
//       return showNotification("error", "Error", "State is required!");
//     if (!customerData.district.trim())
//       return showNotification("error", "Error", "District is required!");

//     try {
//       try {
//         await customerDetail(customerData);
//         console.log("Step 1: Customer saved");
//       } catch (error) {
//         console.log("Step 1 error:", error.message);
//         if (error.message !== "Phone number already exists")
//           return showNotification("error", "Error", "Failed to save customer.");
//       }
//       console.log("ROWS BEFORE SAVE:", JSON.stringify(rows, null, 2));
//       const itemResult = await saveItemDetail(rows);
//       console.log("Step 2: Items saved:", itemResult);
//       const group_code = itemResult.allGroupCode;
//       console.log("Step 2b: group_code:", group_code);

//       const customerResult = await getCustomerByPhone(
//         customerData.phone1Country,
//         customerData.phone1,
//       );
//       console.log("Step 3: Customer fetched:", customerResult);

//       if (!customerResult || !customerResult.customer_id) {
//         return showNotification("error", "Error", "Customer not found!");
//       }

//       const customer_id = customerResult.customer_id;
//       const today = new Date().toISOString().split("T")[0];

//       const saved = await saveInvoice({
//         customer_id,
//         group_code,
//         invoice_date: today,
//       });
//       console.log("Step 4: Invoice saved:", saved);

//       const blob = await pdf(
//         <InvoicePdf
//           customerData={saved.customer}
//           rows={saved.items}
//           invoiceNumber={saved.display_number}
//           invoiceDate={saved.invoice_date}
//           cgstRate={includeGST ? 1.5 : 0}
//           sgstRate={includeGST ? 1.5 : 0}
//         />,
//       ).toBlob();
//       console.log("ROWS DATA:", JSON.stringify(rows, null, 2));
//       console.log("Step 6: PDF blob created");

//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;

//       link.target = "_blank";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       handleReset();
//     } catch (err) {
//       console.error("Invoice error at unknown step:", err);
//       showNotification("error", "Error", "Failed to generate invoice");
//     }
//   };

//   const [notification, setNotification] = useState({
//     isOpen: false,
//     type: "success",
//     title: "",
//     message: "",
//   });

//   const [activeTab, setActiveTab] = useState("Customer Details");

//   const [rows, setRows] = useState([
//     {
//       id: 1,
//       itemCode: "",
//       itemDescription: "",
//       hsnCode: "",
//       quantity: "",
//       unit: "Gms.",
//       rate: "",
//       unitPrice: true,
//       makingCharges: "10",
//     },
//   ]);
//   const showNotification = (type, title, message) => {
//     setNotification({ isOpen: true, type, title, message });
//   };

//   const closeNotification = () => {
//     setNotification((prev) => ({ ...prev, isOpen: false }));
//   };
//   const getDistrictStateByPincode = async (pinCode) => {

//     if (!pinCode || pinCode.length !== 6) return;

//     try {
//       const url = `https://api.postalpincode.in/pincode/${pinCode}`;
//       console.log(url);
//       const response = await fetch(url, {
//         method: "GET",
//         headers: { Accept: "application/json" },
//       });

//       if (!response.ok) throw new Error("API failed");

//       const data = await response.json();

//       if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
//         const postOffice = data[0].PostOffice.at(-1);
//         customerData((prev) => ({
//           ...prev,
//           district: postOffice.District || "",
//           state: postOffice.State || "",
//         }));
//       } else {
//         showNotification("error", "Error", "Invalid PIN Code!");
//       }
//     } catch (error) {
//       console.error("Pincode fetch error:", error);
//     }
//   };
//   const handleAddRow = () => {
//     setRows((prev) => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         itemCode: "",
//         itemDescription: "",
//         hsnCode: "",
//         quantity: "",
//         unit: "Gms.",
//         rate: "",
//         unitPrice: true,
//         makingCharges: "10",
//       },
//     ]);
//   };

//   const handleDeleteRow = (id) => {
//     if (rows.length > 1) {
//       setRows((prev) => prev.filter((row) => row.id !== id));
//     }
//   };

//   const handleRowChange = (id, field, value) => {
//     setRows((prev) =>
//       prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
//     );
//   };

//   const handleReset = () => {
//     customerData({
//       customerName: "",
//       birthday: todayDate(),
//       anniversary: todayDate(),
//       phone1Country: "+91",
//       phone1: "",
//       phone2Country: "+91",
//       phone2: "",
//       pinCode: "",
//       vpo: "",
//       district: "",
//       state: "",
//       email: "",
//       gstin: "03ASRPS4951M1ZO",
//       customerGstin: "",
//     });
//     setRows([
//       {
//         id: 1,
//         itemCode: "",
//         itemDescription: "",
//         hsnCode: "",
//         quantity: "",
//         unit: "Gms.",
//         rate: "",
//         unitPrice: true,
//         makingCharges: "10",
//       },
//     ]);
//   };

//   const handleFetchGoldRateByDate = async (date) => {
//     try {
//       const goldRate = await getGoldRateByDateApi(date);
//       console.log("gold rate : ", goldRate);
//       if (goldRate) {
//         const karat = karatOptions.find((k) => k.value === selectedKarat);
//         const rateKey = karat?.key;
//         const newRate =
//           goldRate[rateKey.replace("goldRate", "gold_rate_").toLowerCase()] ||
//           "";
//         setRows((prev) =>
//           prev.map((row) => (row.unitPrice ? { ...row, rate: newRate } : row)),
//         );
//       }
//     } catch (error) {
//       showNotification(
//         "error",
//         "Not Found",
//         "No gold rate found for the selected date.",
//       );
//     }
//   };
//   const handleGoldRateDateChange = (e) => {
//     const date = e.target.value;
//     setGoldRateDate(date);
//     console.log("Selected gold rate date:", date);
//     handleFetchGoldRateByDate(formatDate(date));
//   };

//   const handleSubmit = async () => {
//     if (!customerData.customerName.trim()) {
//       showNotification("error", "Error", "Customer Name is required!");
//       return;
//     }
//     if (!customerData.phone1.trim() || customerData.phone1.length < 10) {
//       showNotification("error", "Error", "Phone Number must be 10 digits!");
//       return;
//     }
//     if (!customerData.birthday) {
//       showNotification("error", "Error", "Birthday is required!");
//       return;
//     }
//     if (!customerData.pinCode.trim()) {
//       showNotification("error", "Error", "PIN Code is required!");
//       return;
//     }
//     if (customerData.pinCode.length !== 6) {
//       showNotification("error", "Error", "Pin Code must be of 6 digits");
//       return;
//     }
//     if (!customerData.state.trim()) {
//       showNotification("error", "Error", "State is required!");
//       return;
//     }
//     if (!customerData.district.trim()) {
//       showNotification("error", "Error", "District is required!");
//       return;
//     }
//     try {
//       await customerDetail(customerData);
//       showNotification(
//         "success",
//         "Success",
//         "Customer details saved successfully!",
//       );
//     } catch (error) {
//       if (error.message === "Phone number already exists") {
//         showNotification("error", "Error", "Phone number already exists!");
//       } else {
//         showNotification("error", "Error", "Failed to save customer details.");
//       }
//     }
//   };

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     const date = new Date(dateStr);
//     const offset = 5.5 * 60 * 60 * 1000;
//     const istDate = new Date(date.getTime() + offset);
//     return istDate.toISOString().split("T")[0];
//   };

//   const handlePhoneFetch = async (e) => {
//     if (e.key === "Enter" && customerData.phone1.length === 10) {
//       try {
//         const result = await getCustomerByPhone(
//           customerData.phone1Country,
//           customerData.phone1,
//         );
//         if (result) {
//           customerData((prev) => ({
//             ...prev,
//             customerName: result.customer_name || "",
//             birthday: formatDate(result.birthday),
//             anniversary: formatDate(result.anniversary),
//             phone2: result.phone_no2?.slice(-10) || "",
//             email: result.email || "",
//             vpo: result.address || "",
//             state: result.address_state || "",
//             district: result.address_district || "",
//             pinCode: result.address_pincode || "",
//             customerGstin: result.customer_gstin || "",
//           }));
//         } else {
//           showNotification(
//             "error",
//             "Not Found",
//             "No customer found with this phone number.",
//           );
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//       }
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const result = await updateCustomerDetail(customerData);
//       if (result) {
//         showNotification(
//           "success",
//           "Success",
//           "Customer details updated successfully!",
//         );
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//     }
//   };
//   // const handleItemCodeFetch = async (e, rowId) => {
//   //   if (e.key === "Enter" && e.target.value) {
//   //     try {
//   //       const result = await getProductByItemCode(e.target.value);

//   //       if (result && !result.message) {
//   //         setRows((prev) =>
//   //           prev.map((row) =>
//   //             row.id === rowId
//   //               ? {
//   //                   ...row,
//   //                   itemDescription: result.item_description || "",
//   //                   hsnCode: result.hsn_code || "",
//   //                   quantity: result.gross_weight || "",
//   //                 }
//   //               : row,
//   //           ),
//   //         );
//   //       } else {
//   //         showNotification("error", "Not Found", "Product not found!");
//   //       }
//   //     } catch (error) {
//   //       console.error("Error:", error);
//   //     }
//   //   }
//   // };
//   const generateId = () => crypto.randomUUID();

//   const handleItemCodeFetch = async (e, rowId) => {
//     if (e.key === "Enter" && e.target.value) {
//       try {
//         const result = await getProductByItemCode(e.target.value);
//         if (result && result.length > 0) {
//           const currentRow = rows.find((row) => row.id === rowId);

//           const newRows = result.map((item, i) => {
//             const desc = (item.item_description || "").toLowerCase();
//             const isDiamondOrSolitaire =
//               desc.includes("diamond") || desc.includes("solitaire");

//             const goldRateByDescription = handleGoldRateByDecription(
//               item.item_description,
//             );

//             return {
//               ...(i === 0
//                 ? currentRow
//                 : {
//                     id: generateId(),
//                     unit: "Gms.",
//                     rate: "",
//                     unitPrice: false,
//                     makingCharges: "",
//                   }),
//               itemDescription: item.item_description,
//               hsnCode: item.hsn_code,
//               quantity: item.net_weight,
//               unitPrice: i === 0 ? true : false,
//               unit: isDiamondOrSolitaire
//                 ? "Ct."
//                 : i === 0
//                   ? currentRow.unit
//                   : "Gms.",
//               rate: i === 0 ? goldRateByDescription : "",
//             };
//           });

//           setRows((prev) => {
//             const otherRows = prev.filter((row) => row.id !== rowId);
//             return [...otherRows, ...newRows];
//           });
//         } else {
//           showNotification(
//             "error",
//             "Error",
//             "This product is sold or deleted.",
//           );
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     }
//   };

//   const countryCodes = [{ label: "India (+91)", value: "+91" }];

//   return (
//     <div className="w-full">
//       <NotificationModal
//         isOpen={notification.isOpen}
//         onClose={closeNotification}
//         type={notification.type}
//         title={notification.title}
//         message={notification.message}
//       />
//       <div className="bg-gray-200 shadow-lg shadow-gray-600 backdrop-blur-md border border-gray-400 rounded-2xl p-6 w-full mx-auto">
//         {/* Toggle Switch */}
//         <div className="flex flex-col items-center mb-6">
//           <div className="relative w-2/4 h-10 bg-gray-100 rounded-full cursor-pointer flex items-center">
//             <div
//               className={`absolute w-2/4 h-full bg-gray-500 rounded-full transition-all duration-150
//                 ${activeTab === "Customer Details" ? "left-0" : "left-1/2"}`}
//             />
//             <span
//               onClick={() => setActiveTab("Customer Details")}
//               className={`z-10 w-2/4 text-center text-md font-medium cursor-pointer transition-colors
//                 ${activeTab === "Customer Details" ? "text-white" : "text-gray-500"}`}
//             >
//               Customer Details
//             </span>
//             <span
//               onClick={() => setActiveTab("Item Details")}
//               className={`z-10 w-2/4 text-center text-md font-medium cursor-pointer transition-colors
//                 ${activeTab === "Item Details" ? "text-white" : "text-gray-500"}`}
//             >
//               Add Item
//             </span>
//           </div>
//         </div>
//         {activeTab === "Item Details" && (
//           <div className="flex items-center justify-between gap-4 mt-3">

//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 id="gstToggle"
//                 checked={includeGST}
//                 onChange={(e) => setIncludeGST(e.target.checked)}
//                 className="w-5 h-5 cursor-pointer accent-gray-600"
//               />
//               <label
//                 htmlFor="gstToggle"
//                 className="text-md font-medium text-gray-700 cursor-pointer"
//               >
//                 GST
//               </label>
//             </div>

//             <div className="flex items-center gap-3">
//               <input
//                 type="date"
//                 value={goldRateDate}
//                 onChange={handleGoldRateDateChange}
//                 className="text-sm font-semibold text-gray-700 rounded-md px-3 py-1 focus:outline-none cursor-pointer"
//               />

//               <label className="text-md font-medium text-gray-700">
//                 Gold Rate
//               </label>
//               <select
//                 value={selectedKarat}
//                 onChange={(e) => setSelectedKarat(e.target.value)}
//                 className="border border-gray-500 rounded-md px-2 py-1 bg-gray-200 focus:outline-none text-sm"
//               >
//                 {karatOptions.map((k) => (
//                   <option key={k.value} value={k.value}>
//                     {k.label} — ₹{goldRateDate === formatDate(goldRateDate) ? goldRateData?.[k.key] || "N/A" : "N/A"}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}
//         {/* Customer Details Tab */}
//         {activeTab === "Customer Details" && (
//           <div key="customer" className="flex flex-col gap-6">
//             {/* Customer Name */}
//             <div className="relative mb-2">
//               <input
//                 type="text"
//                 id="customerName"
//                 name="customerName"
//                 // value={customerData.customerName}
//                 // onChange={handleChange}
//                 placeholder=" "
//                 className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
//               />
//               <label
//                 htmlFor="customerName"
//                 className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
//               >
//                 Customer Name<span className="text-gray-500 ml-0.5">*</span>
//               </label>
//             </div>

//             {/* Birthday */}
//             <div className="relative mb-2">
//               <input
//                 type="date"
//                 id="birthday"
//                 name="birthday"
//                 // value={customerData.birthday}
//                 // onChange={handleChange}
//                 placeholder=" "
//                 className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
//               />
//               <label
//                 htmlFor="birthday"
//                 className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
//               >
//                 Birthday<span className="text-gray-500 ml-0.5">*</span>
//               </label>
//             </div>

//             {/* Anniversary */}
//             <div className="relative mb-2">
//               <input
//                 type="date"
//                 id="anniversary"
//                 name="anniversary"
//                 // value={customerData.anniversary}
//                 // onChange={handleChange}
//                 placeholder=" "
//                 className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
//               />
//               <label
//                 htmlFor="anniversary"
//                 className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
//               >
//                 Anniversary
//               </label>
//             </div>

//             {/* Phone 1 */}
//             <div className="relative mb-2">
//               <div className="flex gap-2">
//                 <select
//                   name="phone1Country"
//                   // value={customerData.phone1Country}
//                   // onChange={handleChange}
//                   className="peer border border-gray-500 rounded-md px-2 py-2 bg-transparent focus:border-gray-500 focus:outline-none focus:shadow-md w-36"
//                 >
//                   {countryCodes.map((c) => (
//                     <option key={c.value} value={c.value}>
//                       {c.label}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="relative flex-1">
//                   <input
//                     type="tel"
//                     id="phone1"
//                     name="phone1"
//                     // value={customerData.phone1}
//                     // onChange={handleChange}
//                     onKeyDown={handlePhoneFetch}
//                     maxLength="10"
//                     placeholder=" "
//                     className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
//                   />
//                   <label
//                     htmlFor="phone1"
//                     className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-500 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
//                   >
//                     Phone 1<span className="text-gray-500 ml-0.5">*</span>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Phone 2 */}
//             <div className="relative mb-2">
//               <div className="flex gap-2">
//                 <select
//                   name="phone2Country"
//                   // value={customerData.phone2Country}
//                   // onChange={handleChange}
//                   className="peer border border-gray-500 rounded-md px-2 py-2 bg-transparent focus:border-gray-500 focus:outline-none focus:shadow-md w-36"
//                 >
//                   {countryCodes.map((c) => (
//                     <option key={c.value} value={c.value}>
//                       {c.label}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="relative flex-1">
//                   <input
//                     type="tel"
//                     id="phone2"
//                     name="phone2"
//                     // value={customerData.phone2}
//                     // onChange={handleChange}
//                     maxLength="10"
//                     placeholder=" "
//                     className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
//                   />
//                   <label
//                     htmlFor="phone2"
//                     className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-500 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
//                   >
//                     Phone 2
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* PIN Code, VPO, District, State */}
//             <div className="grid grid-cols-4 gap-4">
//               {/* PIN Code */}
//               <div className="relative mb-2">
//                 <input
//                   type="text"
//                   id="pinCode"
//                   name="pinCode"
//                   // value={customerData.pinCode}
//                   // onChange={handleChange}
//                   onBlur={() => getDistrictStateByPincode(customerData.pinCode)}
//                   maxLength="6"
//                   placeholder=" "
//                   className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
//                 />
//                 <label
//                   htmlFor="pinCode"
//                   className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
//                 >
//                   PIN Code<span className="text-gray-500 ml-0.5">*</span>
//                 </label>
//               </div>

//               {/* VPO */}
//               <div className="relative mb-2">
//                 <input
//                   type="text"
//                   id="vpo"
//                   name="vpo"
//                   // value={customerData.vpo}
//                   // onChange={handleChange}
//                   placeholder=" "
//                   className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
//                 />
//                 <label
//                   htmlFor="vpo"
//                   className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
//                 >
//                   VPO<span className="text-gray-500 ml-0.5">*</span>
//                 </label>
//               </div>

//               {/* District */}
//               <div className="relative mb-2">
//                 <input
//                   type="text"
//                   id="district"
//                   name="district"
//                   // value={customerData.district}
//                   // onChange={handleChange}
//                   placeholder=" "
//                   className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
//                 />
//                 <label
//                   htmlFor="district"
//                   className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
//                 >
//                   District<span className="text-gray-500 ml-0.5">*</span>
//                 </label>
//               </div>

//               {/* State */}
//               <div className="relative mb-2">
//                 <input
//                   type="text"
//                   id="state"
//                   name="state"
//                   // value={customerData.state}
//                   // onChange={handleChange}
//                   placeholder=" "
//                   className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
//                 />
//                 <label
//                   htmlFor="state"
//                   className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
//                 >
//                   State<span className="text-gray-500 ml-0.5">*</span>
//                 </label>
//               </div>
//             </div>

//             {/* Email */}
//             <div className="relative mb-2">
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 // value={customerData.email}
//                 // onChange={handleChange}
//                 placeholder=" "
//                 className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
//               />
//               <label
//                 htmlFor="email"
//                 className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
//               >
//                 Email
//               </label>
//             </div>

//             <div className="relative mb-2">
//               <input
//                 type="text"
//                 id="Gstin"
//                 name="Gstin"
//                 // value={customerData.gstin}
//                 // onChange={handleChange}
//                 placeholder=" "
//                 className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
//               />
//               <label
//                 htmlFor="Gstin"
//                 className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
//               >
//                 GSTIN<span className="text-gray-500 ml-0.5">*</span>
//               </label>
//             </div>

//             {/* Customer GSTIN */}
//             <div className="relative mb-2">
//               <input
//                 type="text"
//                 id="customerGstin"
//                 name="customerGstin"
//                 // value={customerData.customerGstin}
//                 // onChange={handleChange}
//                 placeholder=" "
//                 className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
//               />
//               <label
//                 htmlFor="customerGstin"
//                 className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
//               >
//                 Customer GSTIN
//               </label>
//             </div>

//             <div className="flex justify-center gap-3">
//               <button
//                 type="reset"
//                 onClick={handleReset}
//                 className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 transition-all duration-200"
//               >
//                 Reset Details
//               </button>
//               <button
//                 type="submit"
//                 onClick={handleUpdate}
//                 className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
//               >
//                 Update Customer Details
//               </button>
//               <button
//                 type="submit"
//                 onClick={handleSubmit}
//                 className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
//               >
//                 Submit Customer Details
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Item Details Tab */}
//         {activeTab === "Item Details" && (
//           <div
//             key="item"
//             className="flex flex-col gap-6 overflow-x-auto overflow-y-auto max-h-[70vh]"
//           >
//             <table className="w-full text-sm min-w-[900px]">
//               <thead>
//                 <tr className="text-gray-600">
//                   <th className="p-2 border border-gray-300 text-center">
//                     Item Code
//                   </th>
//                   <th className="p-2 border border-gray-300 text-center">
//                     Item Description
//                   </th>
//                   <th className="p-2 border border-gray-300 text-center">
//                     HSN Code
//                   </th>
//                   <th className="p-2 border border-gray-300 text-center">
//                     Quantity
//                   </th>
//                   <th className="p-2 border border-gray-300 text-center">
//                     Unit
//                   </th>
//                   <th className="p-2 border border-gray-300 text-center">
//                     Rate
//                   </th>
//                   <th className="p-2 border border-gray-300 text-center">
//                     Unit Price
//                   </th>
//                   <th className="p-2 border border-gray-300 text-center">
//                     Making Charges (%)
//                   </th>
//                   <th className="p-2 border border-gray-300 text-center"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rows.map((row) => (
//                   <tr key={row.id}>
//                     <td className="p-2 border border-gray-300 text-center">
//                       <input
//                         className="border rounded px-2 py-1 w-30 bg-white"
//                         value={row.itemCode}
//                         onChange={(e) =>
//                           handleRowChange(row.id, "itemCode", e.target.value)
//                         }
//                         onKeyDown={(e) => handleItemCodeFetch(e, row.id)}
//                       />
//                     </td>
//                     <td className="p-2 border border-gray-300 text-center">
//                       <input
//                         className="border rounded px-2 py-1 w-55 bg-white"
//                         value={row.itemDescription}
//                         onChange={(e) =>
//                           handleRowChange(
//                             row.id,
//                             "itemDescription",
//                             e.target.value,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="p-2 border border-gray-300 text-center">
//                       <input
//                         className="border rounded px-2 py-1 w-20 bg-white"
//                         value={row.hsnCode}
//                         onChange={(e) =>
//                           handleRowChange(row.id, "hsnCode", e.target.value)
//                         }
//                       />
//                     </td>
//                     <td className="p-2 border border-gray-300 text-center">
//                       <input
//                         className="border rounded px-2 py-1 w-20 bg-white"
//                         value={row.quantity}
//                         onChange={(e) =>
//                           handleRowChange(row.id, "quantity", e.target.value)
//                         }
//                       />
//                     </td>
//                     <td className="p-2 border border-gray-300 text-center">
//                       <select
//                         className="border rounded px-2 py-1 w-20 bg-white"
//                         value={row.unit}
//                         onChange={(e) =>
//                           handleRowChange(row.id, "unit", e.target.value)
//                         }
//                       >
//                         <option>Gms.</option>
//                         <option>Ct.</option>
//                       </select>
//                     </td>
//                     <td className="p-2 border border-gray-300 text-center">
//                       <input
//                         className="border rounded px-2 py-1 w-20 bg-white"
//                         value={row.rate}
//                         onChange={(e) =>
//                           handleRowChange(row.id, "rate", e.target.value)
//                         }
//                       />
//                     </td>
//                     <td className="p-2 border border-gray-300 text-center">
//                       <input
//                         type="checkbox"
//                         className="w-5 h-5 cursor-pointer accent-gray-600"
//                         checked={row.unitPrice}
//                         onChange={(e) =>
//                           handleRowChange(row.id, "unitPrice", e.target.checked)
//                         }
//                       />
//                     </td>
//                     <td className="p-2 border border-gray-300 text-center">
//                       <input
//                         className="border rounded px-2 py-1 w-24 bg-white"
//                         value={row.makingCharges}
//                         onChange={(e) =>
//                           handleRowChange(
//                             row.id,
//                             "makingCharges",
//                             e.target.value,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="p-2 border border-gray-300 text-center">
//                       <div className="flex gap-1 items-center justify-center">
//                         <button
//                           onClick={handleAddRow}
//                           className="bg-transparent outline-none flex items-center justify-center text-gray-900 hover:text-gray-600"
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-6 w-6"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             viewBox="0 0 24 24"
//                           >
//                             <path d="M12 5v14M5 12h14" />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={() => handleDeleteRow(row.id)}
//                           className="text-red-700 p-1 hover:text-red-500"
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-6 w-6"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="flex justify-center gap-3">
//               <button
//                 type="reset"
//                 onClick={handleReset}
//                 className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 transition-all duration-200"
//               >
//                 Reset
//               </button>

//               <button
//                 type="submit"
//                 onClick={handlePrintInvoice}
//                 className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
//               >
//                 Print Invoice
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  customerDetail,
  getCustomerByPhone,
  updateCustomerDetail,
  getProductByItemCode,
  saveItemDetail,
  saveInvoice,
} from "../../services/api/printinvoice/printInvoiceApi";
import { getGoldRateByDateApi } from "../../services/api/goldrate/goldRateApi";
import { pdf } from "@react-pdf/renderer";
import InvoicePdf from "../../shared/component/InvoicePdf";
// import { useGoldRate } from "../../context/GoldRateContext";
import NotificationModal from "../../shared/utilis/notificationModal";

const karatOptions = [
  { label: "24kt", value: "24K", key: "showGold24K" },
  { label: "22kt", value: "22K", key: "showGold22K" },
  { label: "18kt", value: "18K", key: "showGold18K" },
  { label: "14kt", value: "14K", key: "showGold14K" },
];

const todayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

let customerData = {
  customerName: "",
  birthday: todayDate(),
  anniversary: todayDate(),
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
};

export default function PrintInvoice() {
  const [includeGST, setIncludeGST] = useState(true);
  // const goldRateData = useGoldRate();
  const [selectedKarat, setSelectedKarat] = useState("24K");

  const handleGoldRateByDecription = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes("999")) return showGoldRate?.showGold24K || "";
    if (desc.includes("916")) return showGoldRate?.showGold22K || "";
    if (desc.includes("750")) return showGoldRate?.showGold18K || "";
    if (desc.includes("585")) return showGoldRate?.showGold14K || "";
    return "";
  };
  const [showGoldRate, setShowGoldRate] = useState({
    showGold24K: "",
    showGold22K: "",
    showGold18K: "",
    showGold14K: "",
  });
  const [goldRateDate, setGoldRateDate] = useState(todayDate());

  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const [activeTab, setActiveTab] = useState("Customer Details");

  const [rows, setRows] = useState([
    {
      id: 1,
      itemCode: "",
      itemDescription: "",
      hsnCode: "",
      quantity: "",
      unit: "Gms.",
      rate: showGoldRate?.showGold24K || "",
      unitPrice: true,
      makingCharges: "10",
    },
  ]);

  const showNotification = (type, title, message) => {
    setNotification({ isOpen: true, type, title, message });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    customerData[name] = value;
  };

  const getDistrictStateByPincode = async (pinCode) => {
    if (!pinCode || pinCode.length !== 6) return;
    try {
      const url = `https://api.postalpincode.in/pincode/${pinCode}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice.at(-1);
        customerData.district = postOffice.District || "";
        customerData.state = postOffice.State || "";

        const districtInput = document.getElementById("district");
        const stateInput = document.getElementById("state");
        if (districtInput) districtInput.value = customerData.district;
        if (stateInput) stateInput.value = customerData.state;
      } else {
        showNotification("error", "Error", "Invalid PIN Code!");
      }
    } catch (error) {
      console.error("Pincode fetch error:", error);
    }
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        itemCode: "",
        itemDescription: "",
        hsnCode: "",
        quantity: "",
        unit: "Gms.",
        rate: "",
        unitPrice: true,
        makingCharges: "10",
      },
    ]);
  };

  const handleDeleteRow = (id) => {
    if (rows.length > 1) {
      setRows((prev) => prev.filter((row) => row.id !== id));
    }
  };

  const handleRowChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleReset = () => {
    customerData.customerName = "";
    customerData.birthday = todayDate();
    customerData.anniversary = todayDate();
    customerData.phone1Country = "+91";
    customerData.phone1 = "";
    customerData.phone2Country = "+91";
    customerData.phone2 = "";
    customerData.pinCode = "";
    customerData.vpo = "";
    customerData.district = "";
    customerData.state = "";
    customerData.email = "";
    customerData.gstin = "03ASRPS4951M1ZO";
    customerData.customerGstin = "";

    // Reset all input fields manually
    const fields = [
      "customerName",
      "birthday",
      "anniversary",
      "phone1",
      "phone2",
      "pinCode",
      "vpo",
      "district",
      "state",
      "email",
      "Gstin",
      "customerGstin",
    ];
    fields.forEach((id) => {
      const el = document.getElementById(id);
      if (el)
        el.value = id === "birthday" || id === "anniversary" ? todayDate() : "";
    });

    setRows([
      {
        id: 1,
        itemCode: "",
        itemDescription: "",
        hsnCode: "",
        quantity: "",
        unit: "Gms.",
        rate: showGoldRate?.showGold24K || "",
        unitPrice: true,
        makingCharges: "10",
      },
    ]);
  };
  console.log("Show Gold Rate--> ", showGoldRate);
  const handleFetchGoldRateByDate = async (date) => {
    try {
      const goldRate = await getGoldRateByDateApi(date);
      console.log("Date:", date);
      console.log("Fetched Gold Rate ", goldRate);
      if (goldRate) {
        setShowGoldRate({
          showGold24K: goldRate.gold_rate_24k || "",
          showGold22K: goldRate.gold_rate_22k || "",
          showGold18K: goldRate.gold_rate_18k || "",
          showGold14K: goldRate.gold_rate_14k || "",
        });
        const karat = karatOptions.find((k) => k.value === selectedKarat);
        const rateKey = karat?.key;
        const newRate =
          goldRate[rateKey.replace("showGold", "gold_rate_").toLowerCase()] ||
          "";
        setRows((prev) =>
          prev.map((row) => (row.unitPrice ? { ...row, rate: newRate } : row)),
        );
        console.log("Show Gold Rate ", showGoldRate);
      }
    } catch (error) {
      showNotification(
        "error",
        "Not Found",
        "No gold rate found for the selected date.",
      );
      setShowGoldRate({
        showGold24K: "",
        showGold22K: "",
        showGold18K: "",
        showGold14K: "",
      });
    }
  };
  useEffect(() => {
    const getSelectedRate = () => {
      const karat = karatOptions.find((k) => k.value === selectedKarat);
      return showGoldRate?.[karat?.key] || "";
    };
    const rate = getSelectedRate();
    setRows((prev) =>
      prev.map((row) => (row.unitPrice ? { ...row, rate } : row)),
    );
  }, [selectedKarat, showGoldRate]);

  useEffect(() => {
    handleFetchGoldRateByDate(todayDate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const offset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + offset);
    return istDate.toISOString().split("T")[0];
  };

  const handleGoldRateDateChange = (e) => {
    const date = e.target.value;
    setGoldRateDate(date);
    handleFetchGoldRateByDate(formatDate(date));
  };

  const handlePhoneFetch = async (e) => {
    if (e.key === "Enter" && customerData.phone1.length === 10) {
      try {
        const result = await getCustomerByPhone(
          customerData.phone1Country,
          customerData.phone1,
        );
        if (result) {
          customerData.customerName = result.customer_name || "";
          customerData.birthday = formatDate(result.birthday);
          customerData.anniversary = formatDate(result.anniversary);
          customerData.phone2 = result.phone_no2?.slice(-10) || "";
          customerData.email = result.email || "";
          customerData.vpo = result.address || "";
          customerData.state = result.address_state || "";
          customerData.district = result.address_district || "";
          customerData.pinCode = result.address_pincode || "";
          customerData.customerGstin = result.customer_gstin || "";

          // manually update input fields
          const fieldMap = {
            customerName: customerData.customerName,
            birthday: customerData.birthday,
            anniversary: customerData.anniversary,
            phone2: customerData.phone2,
            email: customerData.email,
            vpo: customerData.vpo,
            state: customerData.state,
            district: customerData.district,
            pinCode: customerData.pinCode,
            customerGstin: customerData.customerGstin,
          };
          Object.entries(fieldMap).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.value = value;
          });
        } else {
          showNotification(
            "error",
            "Not Found",
            "No customer found with this phone number.",
          );
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!customerData.customerName.trim())
      return showNotification("error", "Error", "Customer Name is required!");
    if (!customerData.phone1.trim() || customerData.phone1.length < 10)
      return showNotification(
        "error",
        "Error",
        "Phone Number must be 10 digits!",
      );
    if (!customerData.birthday)
      return showNotification("error", "Error", "Birthday is required!");
    if (!customerData.pinCode.trim())
      return showNotification("error", "Error", "PIN Code is required!");
    if (customerData.pinCode.length !== 6)
      return showNotification("error", "Error", "Pin Code must be of 6 digits");
    if (!customerData.state.trim())
      return showNotification("error", "Error", "State is required!");
    if (!customerData.district.trim())
      return showNotification("error", "Error", "District is required!");
    
    try {
      await customerDetail(customerData);
      showNotification(
        "success",
        "Success",
        "Customer details saved successfully!",
      );
    } catch (error) {
      if (error.message === "Phone number already exists") {
        showNotification("error", "Error", "Phone number already exists!");
      } else {
        showNotification("error", "Error", "Failed to save customer details.");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const result = await updateCustomerDetail(customerData);
      if (result) {
        showNotification(
          "success",
          "Success",
          "Customer details updated successfully!",
        );
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const generateId = () => crypto.randomUUID();

  const handleItemCodeFetch = async (e, rowId) => {
    if (e.key === "Enter" && e.target.value) {
      try {
        const result = await getProductByItemCode(e.target.value);
        if (result && result.length > 0) {
          const currentRow = rows.find((row) => row.id === rowId);
          const newRows = result.map((item, i) => {
            const desc = (item.item_description || "").toLowerCase();
            const isDiamondOrSolitaire =
              desc.includes("diamond") || desc.includes("solitaire");
            const goldRateByDescription = handleGoldRateByDecription(
              item.item_description,
            );
            return {
              ...(i === 0
                ? currentRow
                : {
                    id: generateId(),
                    unit: "Gms.",
                    rate: "",
                    unitPrice: false,
                    makingCharges: "",
                  }),
              itemDescription: item.item_description,
              hsnCode: item.hsn_code,
              quantity: item.net_weight,
              unitPrice: i === 0 ? true : false,
              unit: isDiamondOrSolitaire
                ? "Ct."
                : i === 0
                  ? currentRow.unit
                  : "Gms.",
              rate: i === 0 ? goldRateByDescription : "",
            };
          });
          setRows((prev) => {
            const otherRows = prev.filter((row) => row.id !== rowId);
            return [...otherRows, ...newRows];
          });
        } else {
          showNotification(
            "error",
            "Error",
            "This product is sold or deleted.",
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handlePrintInvoice = async () => {
    if (!customerData.customerName.trim())
      return showNotification("error", "Error", "Customer Name is required!");
    if (!customerData.phone1.trim() || customerData.phone1.length < 10)
      return showNotification(
        "error",
        "Error",
        "Valid Phone Number is required!",
      );
    if (!customerData.birthday)
      return showNotification("error", "Error", "Birthday is required!");
    if (!customerData.vpo.trim())
      return showNotification("error", "Error", "VPO is required!");
    if (!customerData.pinCode.trim())
      return showNotification("error", "Error", "PIN Code is required!");
    if (!customerData.state.trim())
      return showNotification("error", "Error", "State is required!");
    if (!customerData.district.trim())
      return showNotification("error", "Error", "District is required!");
    const stoneKeywords = [
      "STONES",
      "DIAMOND",
      "SOLITAIRE",
      "MINNA",
      "MOTI",
      "COLOR STONE",
      "COLOURING",
    ];
    for (const row of rows) {
      const desc = (row.itemDescription || "").toUpperCase().trim();
      const isStone = stoneKeywords.some((keyword) => desc.includes(keyword));
      if (isStone && (!row.rate || Number(row.rate) === 0)) {
        return showNotification(
          "error",
          "Error",
          `Rate required for: ${row.itemDescription}`,
        );
      }
    }
    try {
      try {
        await customerDetail(customerData);
        console.log("Step 1: Customer saved");
      } catch (error) {
        console.log("Step 1 error:", error.message);
        if (error.message !== "Phone number already exists")
          return showNotification("error", "Error", "Failed to save customer.");
      }

      const itemResult = await saveItemDetail(rows);
      const group_code = itemResult.allGroupCode;

      const customerResult = await getCustomerByPhone(
        customerData.phone1Country,
        customerData.phone1,
      );

      if (!customerResult || !customerResult.customer_id)
        return showNotification("error", "Error", "Customer not found!");

      const customer_id = customerResult.customer_id;
      const today = new Date().toISOString().split("T")[0];

      const saved = await saveInvoice({
        customer_id,
        group_code,
        invoice_date: today,
      });

      const blob = await pdf(
        <InvoicePdf
          customerData={saved.customer}
          rows={saved.items}
          invoiceNumber={saved.display_number}
          invoiceDate={saved.invoice_date}
          cgstRate={includeGST ? 1.5 : 0}
          sgstRate={includeGST ? 1.5 : 0}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      handleReset();
    } catch (err) {
      console.error("Invoice error:", err);
      showNotification("error", "Error", "Failed to generate invoice");
    }
  };

  const countryCodes = [{ label: "India (+91)", value: "+91" }];

  return (
    <div className="w-full">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
      <div className="bg-gray-200 shadow-lg shadow-gray-600 backdrop-blur-md border border-gray-400 rounded-2xl p-6 w-full mx-auto">
        {/* Toggle Switch */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-2/4 h-10 bg-gray-100 rounded-full cursor-pointer flex items-center">
            <div
              className={`absolute w-2/4 h-full bg-gray-500 rounded-full transition-all duration-150
                ${activeTab === "Customer Details" ? "left-0" : "left-1/2"}`}
            />
            <span
              onClick={() => setActiveTab("Customer Details")}
              className={`z-10 w-2/4 text-center text-md font-medium cursor-pointer transition-colors
                ${activeTab === "Customer Details" ? "text-white" : "text-gray-500"}`}
            >
              Customer Details
            </span>
            <span
              onClick={() => setActiveTab("Item Details")}
              className={`z-10 w-2/4 text-center text-md font-medium cursor-pointer transition-colors
                ${activeTab === "Item Details" ? "text-white" : "text-gray-500"}`}
            >
              Add Item
            </span>
          </div>
        </div>

        {activeTab === "Item Details" && (
          <div className="flex items-center justify-between gap-4 mt-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="gstToggle"
                checked={includeGST}
                onChange={(e) => setIncludeGST(e.target.checked)}
                className="w-5 h-5 cursor-pointer accent-gray-600"
              />
              <label
                htmlFor="gstToggle"
                className="text-md font-medium text-gray-700 cursor-pointer"
              >
                GST
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={goldRateDate}
                onChange={handleGoldRateDateChange}
                className="text-sm font-semibold text-gray-700 rounded-md px-3 py-1 focus:outline-none cursor-pointer"
              />
              <label className="text-md font-medium text-gray-700">
                Gold Rate
              </label>
              <select
                value={selectedKarat}
                onChange={(e) => setSelectedKarat(e.target.value)}
                className="border border-gray-500 rounded-md px-2 py-1 bg-gray-200 focus:outline-none text-sm"
              >
                {karatOptions.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label} — ₹{showGoldRate?.[k.key] || "N/A"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Customer Details Tab */}
        {activeTab === "Customer Details" && (
          <div key="customer" className="flex flex-col gap-6">
            <div className="relative mb-2">
              <input
                type="text"
                id="customerName"
                name="customerName"
                defaultValue={customerData.customerName}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
              />
              <label
                htmlFor="customerName"
                className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
              >
                Customer Name<span className="text-gray-500 ml-0.5">*</span>
              </label>
            </div>

            <div className="relative mb-2">
              <input
                type="date"
                id="birthday"
                name="birthday"
                defaultValue={customerData.birthday}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
              />
              <label
                htmlFor="birthday"
                className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
              >
                Birthday<span className="text-gray-500 ml-0.5">*</span>
              </label>
            </div>

            <div className="relative mb-2">
              <input
                type="date"
                id="anniversary"
                name="anniversary"
                defaultValue={customerData.anniversary}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
              />
              <label
                htmlFor="anniversary"
                className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
              >
                Anniversary
              </label>
            </div>

            <div className="relative mb-2">
              <div className="flex gap-2">
                <select
                  name="phone1Country"
                  defaultValue={customerData.phone1Country}
                  onChange={handleChange}
                  className="peer border border-gray-500 rounded-md px-2 py-2 bg-transparent focus:border-gray-500 focus:outline-none focus:shadow-md w-36"
                >
                  {countryCodes.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    id="phone1"
                    name="phone1"
                    defaultValue={customerData.phone1}
                    onChange={handleChange}
                    onKeyDown={handlePhoneFetch}
                    maxLength="10"
                    placeholder=" "
                    className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
                  />
                  <label
                    htmlFor="phone1"
                    className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-500 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
                  >
                    Phone 1<span className="text-gray-500 ml-0.5">*</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="relative mb-2">
              <div className="flex gap-2">
                <select
                  name="phone2Country"
                  defaultValue={customerData.phone2Country}
                  onChange={handleChange}
                  className="peer border border-gray-500 rounded-md px-2 py-2 bg-transparent focus:border-gray-500 focus:outline-none focus:shadow-md w-36"
                >
                  {countryCodes.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    id="phone2"
                    name="phone2"
                    defaultValue={customerData.phone2}
                    onChange={handleChange}
                    maxLength="10"
                    placeholder=" "
                    className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
                  />
                  <label
                    htmlFor="phone2"
                    className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-500 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
                  >
                    Phone 2
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="relative mb-2">
                <input
                  type="text"
                  id="pinCode"
                  name="pinCode"
                  defaultValue={customerData.pinCode}
                  onChange={handleChange}
                  onBlur={() => getDistrictStateByPincode(customerData.pinCode)}
                  maxLength="6"
                  placeholder=" "
                  className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
                />
                <label
                  htmlFor="pinCode"
                  className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
                >
                  PIN Code<span className="text-gray-500 ml-0.5">*</span>
                </label>
              </div>

              <div className="relative mb-2">
                <input
                  type="text"
                  id="vpo"
                  name="vpo"
                  defaultValue={customerData.vpo}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
                />
                <label
                  htmlFor="vpo"
                  className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
                >
                  VPO<span className="text-gray-500 ml-0.5">*</span>
                </label>
              </div>

              <div className="relative mb-2">
                <input
                  type="text"
                  id="district"
                  name="district"
                  defaultValue={customerData.district}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
                />
                <label
                  htmlFor="district"
                  className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
                >
                  District<span className="text-gray-500 ml-0.5">*</span>
                </label>
              </div>

              <div className="relative mb-2">
                <input
                  type="text"
                  id="state"
                  name="state"
                  defaultValue={customerData.state}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
                />
                <label
                  htmlFor="state"
                  className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
                >
                  State<span className="text-gray-500 ml-0.5">*</span>
                </label>
              </div>
            </div>

            <div className="relative mb-2">
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={customerData.email}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
              >
                Email
              </label>
            </div>

            <div className="relative mb-2">
              <input
                type="text"
                id="Gstin"
                name="gstin"
                defaultValue={customerData.gstin}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
              />
              <label
                htmlFor="Gstin"
                className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
              >
                GSTIN<span className="text-gray-500 ml-0.5">*</span>
              </label>
            </div>

            <div className="relative mb-2">
              <input
                type="text"
                id="customerGstin"
                name="customerGstin"
                defaultValue={customerData.customerGstin}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
              />
              <label
                htmlFor="customerGstin"
                className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
              >
                Customer GSTIN
              </label>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="reset"
                onClick={handleReset}
                className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 transition-all duration-200"
              >
                Reset Details
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                Update Customer Details
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                Submit Customer Details
              </button>
            </div>
          </div>
        )}

        {/* Item Details Tab */}
        {activeTab === "Item Details" && (
          <div
            key="item"
            className="flex flex-col gap-6 overflow-x-auto overflow-y-auto max-h-[70vh]"
          >
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-gray-600">
                  <th className="p-2 border border-gray-300 text-center">
                    Item Code
                  </th>
                  <th className="p-2 border border-gray-300 w-[15%] text-center">
                    Item Description
                  </th>
                  <th className="p-2 border border-gray-300 text-center">
                    HSN Code
                  </th>
                  <th className="p-2 border border-gray-300 text-center">
                    Quantity
                  </th>
                  <th className="p-2 border border-gray-300 text-center">
                    Unit
                  </th>
                  <th className="p-2 border border-gray-300 text-center">
                    Rate
                  </th>
                  <th className="p-2 border border-gray-300 text-center">
                    Unit Price
                  </th>
                  <th className="p-2 border border-gray-300 text-center">
                    Making Charges (%)
                  </th>
                  <th className="p-2 border border-gray-300 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="p-2 border border-gray-300">
                      <input
                        className="border rounded px-2 py-1 w-10 bg-white text-center"
                        value={row.itemCode}
                        onChange={(e) =>
                          handleRowChange(row.id, "itemCode", e.target.value)
                        }
                        onKeyDown={(e) => handleItemCodeFetch(e, row.id)}
                      />
                    </td>
                    <td className="p-2 border border-gray-300 ">
                      <input
                        className="border rounded px-1 py-1 w-full bg-white text-center"
                        value={row.itemDescription}
                        onChange={(e) =>
                          handleRowChange(
                            row.id,
                            "itemDescription",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td className="p-2 border border-gray-300 ">
                      <input
                        className="border rounded px-2 py-1 w-20 bg-white text-center"
                        value={row.hsnCode}
                        onChange={(e) =>
                          handleRowChange(row.id, "hsnCode", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        className="border rounded px-2 py-1 w-20 bg-white text-center"
                        value={row.quantity}
                        onChange={(e) =>
                          handleRowChange(row.id, "quantity", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2 border border-gray-300 text-center">
                      <select
                        className="border rounded px-2 py-1 w-20 bg-white"
                        value={row.unit}
                        onChange={(e) =>
                          handleRowChange(row.id, "unit", e.target.value)
                        }
                      >
                        <option>Gms.</option>
                        <option>Ct.</option>
                      </select>
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        className="border rounded px-2 py-1 w-20 bg-white text-center"
                        value={row.rate}
                        onChange={(e) =>
                          handleRowChange(row.id, "rate", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2 border border-gray-300 text-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 cursor-pointer accent-gray-600"
                        checked={row.unitPrice}
                        onChange={(e) =>
                          handleRowChange(row.id, "unitPrice", e.target.checked)
                        }
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      <input
                        className="border rounded px-2 py-1 w-24 bg-white text-center"
                        value={row.makingCharges}
                        onChange={(e) =>
                          handleRowChange(
                            row.id,
                            "makingCharges",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td className="p-2 border border-gray-300 text-center">
                      <div className="flex gap-1 items-center justify-center">
                        <button
                          onClick={handleAddRow}
                          className="bg-transparent outline-none flex items-center justify-center text-gray-900 hover:text-gray-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteRow(row.id)}
                          className="text-red-700 p-1 hover:text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center gap-3">
              <button
                type="reset"
                onClick={handleReset}
                className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 transition-all duration-200"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handlePrintInvoice}
                className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                Print Invoice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
