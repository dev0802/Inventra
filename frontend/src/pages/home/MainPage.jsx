import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MainPage({ setIsLoggedIn }) {
  const userName = localStorage.getItem("userName");
  const userNameSignup = localStorage.getItem("userNameSignup");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettingDropdown, setShowSettingDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [goldRate, setGoldRate] = useState("");
  // const [manualInvoice, setManualInvoice] = useState(false);

  const displayName = userName || userNameSignup;
  const firstName = displayName ? displayName.split(" ")[0] : "User";
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="w-full flex items-center justify-between bg-gray-400 px-4 md:px-8 py-3 md:py-4">
        <h1 className="text-white text-sm md:text-xl font-bold tracking-widest uppercase">
          BrandEase
        </h1>
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
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-white text-xs md:text-sm font-semibold px-2 md:px-4 py-1 md:py-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 transition-all duration-200"
          >
            {firstName}
          </button>
          {showDropdown && (
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
          )}
        </div>
        
        <div className="relative">
          <button onClick={() => setShowSettingDropdown(!showSettingDropdown)} className="ml-7 text-gray-200 hover:text-gray-700 font-bold text-3xl">
            &#8942;
          </button>
          {showSettingDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-gray-500 rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  setShowSettings(true);
                }}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-400 "
              >
                Update Gold Rate

              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-400 "
              >
                Update Invoice
              </button>
              <button
                // onClick={() => {
                //   setShowSettings(true);
                // }}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-400 rounded-lg"
              >
                Manual Invoice
              </button>
            </div>
          )}
        </div>
      </header>

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
            <div className="flex items-center justify-left mb-5">
              
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
            <div className="relative mb-5">
              <input
                id="goldRate"
                value={goldRate}
                onChange={(e) => setGoldRate(e.target.value)}
                placeholder=" "
                className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-600 focus:outline-none"
              />
              <label
                htmlFor="goldRate"
                className="absolute left-3 -top-3 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2
                  peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-700"
              >
                Gold Rate (per gram) ₹
              </label>
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
                onClick={() => {
                  // Save logic here (e.g. localStorage.setItem)
                  localStorage.setItem("goldRate", goldRate);
                  // localStorage.setItem("manualInvoice", manualInvoice);
                  setShowSettings(false);
                }}
                className="text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
