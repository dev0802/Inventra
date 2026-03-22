import React, { useState } from "react";
import { Routes, Route} from "react-router-dom";
import AuthRoutes from "../pages/login/AuthRoutes";
import MainPage from "../pages/home/MainPage";

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
            <div className={!isLoggedIn ? "blur-md pointer-events-none" : ""}>
              <MainPage />
            </div>
          }
        />

        {/* Main Page */}
        <Route
          path="/main"
          element={
            <div className={!isLoggedIn ? "blur-md pointer-events-none" : ""}>
              <MainPage />
            </div>
          }
        />
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

