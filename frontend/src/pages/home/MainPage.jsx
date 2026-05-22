import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import {
  setGoldRateApi,
  getLatestGoldRateApi,
  getGoldRateByDateApi,
} from "../../services/api/goldrate/goldRateApi";
import NotificationModal from "../../shared/utilis/notificationModal";
import logo from "../../assets/images/brandease_logo.png";
import { logOut, verifySession } from "../../services/api/auth/authApi";
import {
  getInvoiceByNumberAndFY,
  getProductByItemCode,
  updateInvoice,
  deleteInvoice
} from "../../services/api/printinvoice/printInvoiceApi";
import DuplicateInvoiceCopyPdf from "../../shared/component/DuplicateInvoiceCopyPdf";
import InvoicePdf from "../../shared/component/InvoicePdf";
export default function MainPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const todayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // const [showDropdown, setShowDropdown] = useState(false);
  const [showSettingDropdown, setShowSettingDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [goldRateData, setGoldRateData] = useState({
    goldRate24K: "",
    goldRate22K: "",
    goldRate18K: "",
    goldRate14K: "",
    rateDate: todayDate(),
  });

  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const [userName, setUserName] = useState("");
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await verifySession();
        if (response.message === "Session is valid") {
          setIsLoggedIn(true);
          setUserName(response.user.userName);
        } else {
          setIsLoggedIn(false);
          navigate("/");
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setIsLoggedIn(false);
        navigate("/main/printinvoice");
      }
    };

    checkSession();
  }, [navigate, setIsLoggedIn]);

  const showNotification = (type, title, message) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const closeNotification = () => {
    setNotification((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };
  // const [manualInvoice, setManualInvoice] = useState(false);

  useEffect(() => {
    const fetchGoldRate = async () => {
      try {
        const latestGoldRate = await getLatestGoldRateApi();
        setGoldRateData({
          goldRate24K: latestGoldRate.gold_rate_24k,
          goldRate22K: latestGoldRate.gold_rate_22k,
          goldRate18K: latestGoldRate.gold_rate_18k,
          goldRate14K: latestGoldRate.gold_rate_14k,
          rateDate: latestGoldRate.rate_date
            ? new Date(latestGoldRate.rate_date).toLocaleDateString("en-CA")
            : todayDate(),
        });
      } catch (error) {
        console.error("Error fetching gold rate:", error);
      }
    };

    fetchGoldRate();
  }, []);

  const firstName = userName ? userName.split(" ")[0] : "User";

  const handleLogout = async () => {
    try {
      await logOut();
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      showNotification(
        "error",
        "Logout Failed",
        "An error occurred while logging out. Please try again.",
      );
    } finally {
      setIsLoggedIn(false);
      navigate("/");
      setShowSettingDropdown(false);
    }
  };

  const handleGoldRateChange = (e) => {
    const rateValue = e.target.value;
    const rateName = e.target.name; // input pe name attribute chahiye
    setGoldRateData((prev) => ({
      ...prev,
      [rateName]: rateValue,
    }));
  };

  const handleGoldRateClick = async () => {
    if (
      !goldRateData.goldRate24K ||
      !goldRateData.goldRate22K ||
      !goldRateData.goldRate18K ||
      !goldRateData.goldRate14K
    ) {
      showNotification(
        "error",
        "Missing Fields",
        "Please fill in all gold rate fields before saving.",
      );
      return;
    }

    try {
      await setGoldRateApi(goldRateData);
      setShowSettings(false);
    } catch (error) {
      console.error("Error setting gold rate:", error);
    }
  };

  const handlefetchGoldRateByDate = async (date) => {
    try {
      const goldRate = await getGoldRateByDateApi(date);
      if (goldRate) {
        setGoldRateData({
          goldRate24K: goldRate.gold_rate_24k,
          goldRate22K: goldRate.gold_rate_22k,
          goldRate18K: goldRate.gold_rate_18k,
          goldRate14K: goldRate.gold_rate_14k,
          rateDate: date,
        });
      }
    } catch (error) {
      setGoldRateData((prev) => ({
        ...prev,
        goldRate24K: "",
        goldRate22K: "",
        goldRate18K: "",
        goldRate14K: "",
      }));
      showNotification(
        "error",
        "Not Found",
        "No gold rate found for the selected date.",
      );
    }
  };
  const [showUpdateInvoice, setShowUpdateInvoice] = useState(false);

  const handlePrintDuplicate = async () => {
  try {

    await updateInvoice(foundInvoice.invoice_id, {
      customer: foundInvoice.customer,
      items: foundInvoice.items,
      invoice_date: foundInvoice.invoice_date,
    });

    const blob = await pdf(
      <DuplicateInvoiceCopyPdf
        customerData={foundInvoice.customer}
        rows={foundInvoice.items}
        invoiceNumber={foundInvoice.display_number || foundInvoice.invoice_number}
        invoiceDate={foundInvoice.invoice_date}
        cgstRate={1.5}
        sgstRate={1.5}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Duplicate-Invoice-${foundInvoice.invoice_number}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification("success", "Success", "Invoice saved & duplicate printed!");

  } catch {
    showNotification("error", "Error", "Failed to save or print invoice.");
  }
};

  const getCurrentFY = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return month >= 3
      ? `${year}-${String(year + 1).slice(-2)}`
      : `${year - 1}-${String(year).slice(-2)}`;
  };

  const [updateSearch, setUpdateSearch] = useState({
    invoiceNumber: "",
    financialYear: getCurrentFY(),
  });
  const [foundInvoice, setFoundInvoice] = useState(null);

  const fyList = ["2023-24", "2024-25", "2025-26", "2026-27"];
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearchInvoice();
  };
  const handleUpdateItemCodeFetch = async (e, idx) => {
    if (e.key === "Enter" && e.target.value) {
      try {
        const result = await getProductByItemCode(e.target.value);
        if (result && result.length > 0) {
          setFoundInvoice((prev) => {
            const items = [...prev.items];
            const currentItem = items[idx];
            const newItems = result.map((item, i) => ({
              ...(i === 0
                ? currentItem
                : {
                    unit: "Gms.",
                    rate: "",
                    unit_price: false,
                    making_charges: "",
                  }),
                  item_code: e.target.value,
                  code: e.target_value,
                  item_description: item.item_description,
              hsn_code: item.hsn_code,
              quantity: item.gross_weight,
              unit_price: i === 0 ? true : false,
            }));
            items.splice(idx, 1, ...newItems);
            return { ...prev, items };
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

  const handleDeleteInvoice = async () => {
  try {
    await deleteInvoice(foundInvoice.invoice_id);
    showNotification("success", "Deleted", "Invoice deleted successfully!");
    // setShowDeleteConfirm(false);
    setShowUpdateInvoice(false);
    setFoundInvoice(null);
  } catch {
    showNotification("error", "Error", "Failed to delete invoice.");
  }
};
  const handleSearchInvoice = async () => {
    if (!updateSearch.invoiceNumber)
      return showNotification("error", "Error", "Invoice number required!");
    try {
      const res = await getInvoiceByNumberAndFY(
        updateSearch.invoiceNumber,
        updateSearch.financialYear,
      );
      setFoundInvoice(res);
    } catch {
      setFoundInvoice(null);
      showNotification("error", "Not Found", "No invoice found.");
    }
  };

  const handleItemChange = (idx, field, value) => {
    setFoundInvoice((prev) => {
      const items = [...prev.items];
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, items };
    });
  };

  const handleAddItem = (afterIdx) => {
    setFoundInvoice((prev) => {
      const items = [...prev.items];
      items.splice(afterIdx + 1, 0, {
        item_description: "",
        code: "",
        hsn_code: "",
        quantity: "",
        unit: "Gms.",
        rate: "",
        unit_price: false,
        making_charges: "",
      });
      return { ...prev, items };
    });
  };

  const handleDeleteItem = (idx) => {
    setFoundInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveInvoice = async () => {
    try {
      await updateInvoice(foundInvoice.invoice_id, {
        customer: foundInvoice.customer,
        items: foundInvoice.items,
        invoice_date: foundInvoice.invoice_date,
      });
      const blob = await pdf(
      <InvoicePdf
        customerData={foundInvoice.customer}
        rows={foundInvoice.items}
        invoiceNumber={foundInvoice.display_number || foundInvoice.invoice_number}
        invoiceDate={foundInvoice.invoice_date}
        cgstRate={1.5}
        sgstRate={1.5}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${foundInvoice.invoice_number}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification("success", "Success", "Invoice updated & printed!");
    setShowUpdateInvoice(false);
    setFoundInvoice(null);
    
    } catch {
      showNotification("error", "Error", "Failed to update invoice.");
    }
  };

  return (
    <>
      <div className="min-h-screen  overflow-x-hidden">
        <NotificationModal
          isOpen={notification.isOpen}
          onClose={closeNotification}
          type={notification.type}
          title={notification.title}
          message={notification.message}
        />
        {/* Header */}
        <header className="w-full fixed flex items-center justify-between bg-gray-400 px-4 md:px-8 py-3 md:py-4 z-50">
          <div>
            <img
              src={logo}
              alt="BrandEase Logo"
              className="h-8 md:h-10 mix-blend-multiply"
            />
          </div>
          <div className="w-full flex justify-center">
            <nav className="flex flex-row justify-center gap-1 sm:gap-5 bg-transparent">
              <NavLink
                to="/main/printinvoice"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center text-center text-gray-600 text-lg  border-gray-600 font-bold px-1 md:px-4 py-1.5 md:py-2 whitespace-nowrap self-stretch"
                    : "flex items-center text-center text-white text-lg  border-transparent hover:border-gray-600 hover:text-gray-600 font-bold px-1 md:px-4 py-1.5 md:py-2 whitespace-nowrap self-stretch"
                }
              >
                Print Invoice
              </NavLink>
              <NavLink
                to="/main/addproducts"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center text-center text-gray-600 text-lg  border-gray-600 font-bold px-1 md:px-4 py-1.5 md:py-2 whitespace-nowrap self-stretch"
                    : "flex items-center text-center text-white text-lg  border-transparent hover:border-gray-600 hover:text-gray-600 font-bold px-1 md:px-4 py-1.5 md:py-2 whitespace-nowrap self-stretch"
                }
              >
                Add Products
              </NavLink>
              <NavLink
                to="/main/viewproducts"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center text-center text-gray-600 text-lg  border-gray-600 font-bold px-1 md:px-4 py-1.5 md:py-2 whitespace-nowrap self-stretch"
                    : "flex items-center text-center text-white text-lg  border-transparent hover:border-gray-600 hover:text-gray-600 font-bold px-1 md:px-4 py-1.5 md:py-2 whitespace-nowrap self-stretch"
                }
              >
                View Products
              </NavLink>

              <NavLink
                to="/main/report"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center text-center text-gray-600 text-lg  border-gray-600 font-bold px-1 md:px-4 py-1.5 md:py-2 whitespace-nowrap self-stretch"
                    : "flex items-center text-center text-white text-lg  border-transparent hover:border-gray-600 hover:text-gray-600 font-bold px-1 md:px-4 py-1.5 md:py-2 whitespace-nowrap self-stretch"
                }
              >
                Report
              </NavLink>
            </nav>
          </div>

          <div className="relative">
            <button className="text-white text-md md:text-lg font-semibold px-2 md:px-4 py-1 md:py-2 ">
              {firstName}
            </button>
            {/* {showDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-gray-500 rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  localStorage.removeItem("userName");
                  setIsLoggedIn(false);
                  navigate("/");
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-400 rounded-lg"
              >
                Logout
              </button>
            </div>
          )} */}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSettingDropdown(!showSettingDropdown)}
              className="ml-7 text-gray-200 hover:text-gray-700 font-bold text-3xl"
            >
              &#8942;
            </button>
            {showSettingDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-gray-500 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    setShowSettings(true);
                    setShowSettingDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-400 "
                >
                  Update Gold Rate
                </button>
                <button
                  onClick={() => {
                    setShowUpdateInvoice(true);
                    setShowSettingDropdown(false);
                    setFoundInvoice(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-400 "
                >
                  Update Invoice
                </button>
                <button
                  // onClick={() => {
                  //   setShowSettings(true);
                  // }}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-400 "
                >
                  Manual Invoice
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-400 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {showUpdateInvoice && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => {
              setShowUpdateInvoice(false);
              setFoundInvoice(null);
            }}
          >
            <div
              className="bg-gray-200 shadow-lg shadow-gray-600 border border-gray-400 rounded-2xl w-full max-w-6xl mx-4 max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Search Row ── */}
              <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-400 flex-wrap">
                <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Enter Invoice Number:
                </label>
                <input
                  type="number"
                  value={updateSearch.invoiceNumber}
                  onChange={(e) =>
                    setUpdateSearch((p) => ({
                      ...p,
                      invoiceNumber: e.target.value,
                    }))
                  }
                  onKeyDown={handleSearchKeyDown}
                  className="w-24 border border-gray-500 rounded-md px-3 py-1.5 bg-gray-200 focus:outline-none focus:shadow-md text-sm"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Financial Year
                </label>
                <select
                  value={updateSearch.financialYear}
                  onChange={(e) =>
                    setUpdateSearch((p) => ({
                      ...p,
                      financialYear: e.target.value,
                    }))
                  }
                  className="border border-gray-500 rounded-md px-3 py-1.5 bg-gray-200 focus:outline-none text-sm"
                >
                  {fyList.map((fy) => (
                    <option key={fy}>{fy}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setFoundInvoice(null);
                    setUpdateSearch({
                      invoiceNumber: "",
                      financialYear: getCurrentFY(),
                    });
                  }}
                  className="text-white text-sm font-semibold px-5 py-1.5 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all"
                >
                  Reset
                </button>
              </div>

              {foundInvoice ? (
                <>
                  {/* ── Customer Fields ── */}
                  <div className="px-6 py-4 border-b border-gray-400">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Customer Name", field: "name" },
                        { label: "Phone", field: "phone_no1" },
                        { label: "Address", field: "address" },
                        { label: "State", field: "address_state" },
                        { label: "District", field: "address_district" },
                        { label: "PIN Code", field: "address_pincode" },
                      ].map(({ label, field }) => (
                        <div key={field} className="relative">
                          <input
                            value={foundInvoice.customer?.[field] || ""}
                            onChange={(e) =>
                              setFoundInvoice((p) => ({
                                ...p,
                                customer: {
                                  ...p.customer,
                                  [field]: e.target.value,
                                },
                              }))
                            }
                            placeholder=" "
                            className="peer w-full border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:outline-none focus:shadow-md text-sm"
                          />
                          <label
                            className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-sm pointer-events-none
                    transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600
                    peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                          >
                            {label}
                          </label>
                        </div>
                      ))}

                      {/* Invoice Date */}
                      <div className="relative">
                        <input
                          type="date"
                          value={foundInvoice.invoice_date?.split("T")[0] || ""}
                          onChange={(e) =>
                            setFoundInvoice((p) => ({
                              ...p,
                              invoice_date: e.target.value,
                            }))
                          }
                          className="peer w-full border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:outline-none focus:shadow-md text-sm"
                        />
                        <label className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-sm pointer-events-none">
                          Invoice Date
                        </label>
                      </div>

                      {/* Invoice Number read-only */}
                      <div className="relative">
                        <input
                          value={
                            foundInvoice.display_number ||
                            `${foundInvoice.invoice_number}`
                          }
                          readOnly
                          className="w-full border border-gray-400 rounded-md px-3 py-2 bg-gray-300 text-gray-500 text-sm cursor-not-allowed"
                        />
                        <label className="absolute left-3 -top-3.5 bg-gray-100 px-1 text-gray-500 text-sm pointer-events-none">
                          Invoice Number (read-only)
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* ── Items Table ── */}
                  <div className="px-6 py-4 border-b border-gray-400 overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-[900px]">
                      <thead>
                        <tr className="text-gray-600">
                          {[
                            "Sno.",
                            "Item Code",
                            "Item Name",
                            "Item Qty",
                            "Unit",
                            "Rate",
                            "Unit Price",
                            "Making (%)",
                            "Actions",
                          ].map((h) => (
                            <th
                              key={h}
                              className="p-2 border border-gray-300 text-center font-semibold text-xs"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {foundInvoice.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-1 border border-gray-300 text-center text-gray-500 text-xs">
                              {item.is_main_item !== false ? idx + 1 : ""}
                            </td>
                            <td className="p-1 border border-gray-300">
                              <input
                                value={item.item_code || item.code || ""}
                                onChange={(e) =>
                                  handleItemChange(idx, "code", e.target.value)
                                }
                                onKeyDown={(e) =>
                                  handleUpdateItemCodeFetch(e, idx)
                                }
                                className="border rounded px-1.5 py-1 w-16 bg-white text-xs"
                              />
                            </td>
                            <td className="p-1 border border-gray-300">
                              <input
                                value={item.item_description || ""}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    "item_description",
                                    e.target.value,
                                  )
                                }
                                className="border rounded px-1.5 py-1 w-44 bg-white text-xs"
                              />
                            </td>
                            <td className="p-1 border border-gray-300">
                              <input
                                value={item.quantity || ""}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    "quantity",
                                    e.target.value,
                                  )
                                }
                                className="border rounded px-1.5 py-1 w-16 bg-white text-xs"
                              />
                            </td>
                            <td className="p-1 border border-gray-300">
                              <select
                                value={item.unit || "Gms."}
                                onChange={(e) =>
                                  handleItemChange(idx, "unit", e.target.value)
                                }
                                className="border rounded px-1 py-1 w-16 bg-white text-xs"
                              >
                                <option>Gms.</option>
                                <option>Ct.</option>
                              </select>
                            </td>
                            <td className="p-1 border border-gray-300">
                              <input
                                value={item.rate || ""}
                                onChange={(e) =>
                                  handleItemChange(idx, "rate", e.target.value)
                                }
                                className="border rounded px-1.5 py-1 w-20 bg-white text-xs"
                              />
                            </td>
                            <td className="p-1 border border-gray-300 text-center">
                              <input
                                type="checkbox"
                                checked={!!item.unit_price}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    "unit_price",
                                    e.target.checked,
                                  )
                                }
                                className="w-4 h-4 cursor-pointer accent-gray-600"
                              />
                            </td>
                            <td className="p-1 border border-gray-300">
                              <input
                                value={item.making_charges || ""}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    "making_charges",
                                    e.target.value,
                                  )
                                }
                                className="border rounded px-1.5 py-1 w-16 bg-white text-xs"
                              />
                            </td>
                            <td className="p-1 border border-gray-300 text-center">
                              <div className="flex gap-1 justify-center">
                                <button
                                  onClick={() => handleDeleteItem(idx)}
                                  className="text-red-700 hover:text-red-500 p-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
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
                                <button
                                  onClick={() => handleAddItem(idx)}
                                  className="text-gray-700 hover:text-gray-500 p-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 5v14M5 12h14" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* ── Bottom Buttons ── */}
                  <div className="flex justify-center gap-3 px-6 py-4">
                    <button
                      onClick={handleDeleteInvoice}
                      className="text-white text-sm font-semibold px-5 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all"
                    >
                      Delete Invoice
                    </button>
                    <button
                      onClick={handlePrintDuplicate}
                      className="text-white text-sm font-semibold px-5 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all"
                    >
                      Print Duplicate Copy
                    </button>
                    <button
                      onClick={handleSaveInvoice}
                      className="text-white text-sm font-semibold px-5 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all"
                    >
                      Print Invoice
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-16 text-center text-gray-500 text-sm">
                  Enter invoice number to fetch and update invoice details.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Popup Overlay */}

        {showSettings && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <div
              className="bg-gray-200 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Popup Header */}
              <div className="flex items-center justify-between mb-5">
                <input
                  type="date"
                  value={goldRateData.rateDate || todayDate()}
                  onChange={(e) => {
                    handleGoldRateChange(e);
                    handlefetchGoldRateByDate(e.target.value);
                  }}
                  name="rateDate"
                  className="text-md font-bold text-gray-700 border-none bg-transparent focus:ring-0"
                />
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Gold Rate Input */}
              <div className=" mb-5 gap-4">
                <div className="space-y-6">
                  <div className="relative">
                    <input
                      id="goldRate"
                      value={goldRateData.goldRate24K}
                      onChange={handleGoldRateChange}
                      name="goldRate24K"
                      placeholder=" "
                      className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-600 focus:outline-none"
                    />
                    <label
                      htmlFor="goldRate"
                      className="absolute left-3 -top-3 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2
                  peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-700"
                    >
                      Gold Rate (per gram for 24kt) ₹
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="goldRate"
                      value={goldRateData.goldRate22K}
                      onChange={handleGoldRateChange}
                      name="goldRate22K"
                      placeholder=" "
                      className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-600 focus:outline-none"
                    />
                    <label
                      htmlFor="goldRate"
                      className="absolute left-3 -top-3 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2
                  peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-700"
                    >
                      Gold Rate (per gram for 22kt) ₹
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="goldRate"
                      value={goldRateData.goldRate18K}
                      onChange={handleGoldRateChange}
                      name="goldRate18K"
                      placeholder=" "
                      className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-600 focus:outline-none"
                    />
                    <label
                      htmlFor="goldRate"
                      className="absolute left-3 -top-3 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2
                  peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-700"
                    >
                      Gold Rate (per gram for 18kt) ₹
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="goldRate"
                      value={goldRateData.goldRate14K}
                      onChange={handleGoldRateChange}
                      name="goldRate14K"
                      placeholder=" "
                      className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-600 focus:outline-none"
                    />
                    <label
                      htmlFor="goldRate"
                      className="absolute left-3 -top-3 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2
                  peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-700"
                    >
                      Gold Rate (per gram for 14kt) ₹
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-600 text-sm font-semibold px-4 py-2 rounded-full border border-gray-400 hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGoldRateClick}
                  className="text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 mt-16">
          <Outlet />
        </main>
      </div>
      <div>
        <footer className="w-full bg-gray-400 border-t border-gray-200 px-8 py-4 flex justify-between items-center">
          {/* Left - BrandEase */}
          <div className="flex items-center gap-2  ">
            {/* <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center font-bold text-white text-xs">B</div> */}
            <div>
              <span className="font-bold text-gray-800 text-md">BrandEase</span>
              <p className="text-sm font-bold text-gray-700">
                Helping businesses grow through technology and marketing.
              </p>
              <p className="text-sm font-bold text-white leading-tight">
                Software · Web Development · Digital Marketing
              </p>
            </div>
          </div>

          {/* Center - Copyright */}
          <div className="text-center text-sm text-gray-800">
            <p className="font-bold ">
              For support or inquiries, please contact us:{" "}
            </p>
            <p className="font-semibold italic">
              E-mail : Brandeaseofficial@gmail.com | Phone : 8979163914
            </p>

            <p className="text-sm text-white">
              © 2025 BrandEase. All rights reserved.
            </p>
          </div>

          {/* Right - Inventra */}
          <div className="text-right">
            {/* <span className="text-xs text-gray-400">Powered by</span> */}
            <p className="text-lg font-semibold text-white">Inventra</p>
            <span className="text-sm text-gray-800 italic">
              A BrandEase Product
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
