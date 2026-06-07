import React, { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const AuthRoutes    = lazy(() => import("../pages/login/AuthRoutes"));
const MainPage      = lazy(() => import("../pages/home/MainPage"));
const AddProduct    = lazy(() => import("../pages/addproducts/AddProduct"));
const ViewProduct   = lazy(() => import("../pages/viewproducts/ViewProduct"));
const PrintInvoice  = lazy(() => import("../pages/printinvoice/PrintInvoice"));
const Report        = lazy(() => import("../pages/report/Report"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function LayoutRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [manualInvoice, setManualInvoice] = useState(false);
  return (
    <div className="relative min-h-screen">

      <Suspense fallback={<PageLoader />}>
        {isLoggedIn && (
          
        <Routes>

          <Route
            path="/"
            element={
              <div className={!isLoggedIn ? "blur-sm pointer-events-none" : ""}>
                <MainPage setIsLoggedIn={setIsLoggedIn} manualInvoice={manualInvoice} setManualInvoice={setManualInvoice} />
              </div>
            }
          />

          <Route
            path="/main/*"
            element={
              <div className={!isLoggedIn ? "blur-sm pointer-events-none" : ""}>
                <MainPage setIsLoggedIn={setIsLoggedIn} manualInvoice={manualInvoice} setManualInvoice={setManualInvoice} />
              </div>
            }
          >
            <Route path="addproducts"  element={<AddProduct />} />
            <Route path="viewproducts" element={<ViewProduct />} />
            <Route path="printinvoice" element={<PrintInvoice manualInvoice={manualInvoice} setManualInvoice={setManualInvoice} />} />
            <Route path="report"       element={<Report />} />
          </Route>

        </Routes>
        )}
      </Suspense>

      {/* Overlay */}
      {!isLoggedIn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Suspense fallback={<PageLoader />}>
            <AuthRoutes setIsLoggedIn={setIsLoggedIn} />
          </Suspense>
        </div>
      )}

    </div>
  );
}