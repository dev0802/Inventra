import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthRoutes from "../pages/login/AuthRoutes";
import MainPage from "../pages/home/MainPage";
import AddProduct from "../pages/addproducts/AddProduct";
import ViewProduct from "../pages/viewproducts/ViewProduct";
import PrintInvoice from "../pages/printinvoice/PrintInvoice";
export default function LayoutRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (

    <div className="relative min-h-screen">

      {/* Routes */}
      <Routes>

        {/* <Route path="/" element={<Navigate to="/main" />} /> */}

        <Route
          path="/"
          element={
            <div className={!isLoggedIn ? "blur-sm pointer-events-none" : ""}>
              <MainPage />
            </div>
          }
        />

        {/* Main Page */}
        <Route
          path="/main"
          element={
            <div className={!isLoggedIn ? "blur-sm pointer-events-none" : ""}>
              <MainPage setIsLoggedIn={setIsLoggedIn} />
            </div>
          }
        >
          <Route path="addproducts" element={<AddProduct />} />
          <Route path="viewproducts" element={<ViewProduct />} />
          <Route path="printinvoice" element={<PrintInvoice/>}/>
          <Route path="report" element={<div className="p-4">Report Page - Coming Soon!</div>} />
        </Route>
      </Routes>

      {/* Overlay */}

      {!isLoggedIn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <AuthRoutes setIsLoggedIn={setIsLoggedIn} />
        </div>
      )}

    </div>

  );
}

