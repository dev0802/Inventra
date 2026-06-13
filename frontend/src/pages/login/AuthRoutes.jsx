import React from 'react'
import { useState } from 'react'
import LoginPage from './LoginPage'
import SignUp from './SignUp'
import ForgotPassword from './ForgotPassword'
export default function AuthRoutes({ setIsLoggedIn }) {
    // State variable to track the current mode (Sign In, Sign Up, or Forgot Password)
    const [mode, setMode] = useState("Sign In");
    return (
        <div className="w-[400px] bg-gray-200 p-9 rounded-2xl shadow-xl m-10">
            {/* Conditionally render the appropriate component based on the current mode */}
            
            {mode === "Sign In" && <LoginPage setMode={setMode} setIsLoggedIn={setIsLoggedIn} />}
            {mode === "Sign Up" && <SignUp setMode={setMode} setIsLoggedIn={setIsLoggedIn} />}
            {mode === "Forgot Password" && <ForgotPassword setMode={setMode} />}
        </div>
    )
}
