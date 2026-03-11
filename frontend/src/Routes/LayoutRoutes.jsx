import React from 'react'
import AuthRoutes from '../pages/login/AuthRoutes'
import MainPage from '../pages/home/MainPage'
import { useState } from 'react';
import {Routes, Route} from 'react-router-dom'
export default function LayoutRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="relative">

      {/* Background page */}
      <div className={isLoggedIn ? "" : "blur-md pointer-events-none"}>
        <Routes>
          <Route path="/" element = {<MainPage />} /> 
        </Routes>
      </div>

      {/* Login Overlay */}
      {!isLoggedIn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <AuthRoutes setIsLoggedIn={setIsLoggedIn} />
        </div>
      )}

    </div>
  )
}
