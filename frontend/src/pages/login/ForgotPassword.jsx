import React from 'react'

export default function ForgotPassword({ setMode }) {
    return (
        <form>
            {/* Heading */}
            <div className="text-center lg:text-left mb-6">
                <h2 className="text-2xl text-gray-800 font-bold text-center">
                    Reset Password
                </h2>
            </div>
            {/* Phone Number */}
            <div className="relative mb-4">
                <input
                    type="text"
                    id="phone"
                    pattern="[0-9]{10}"
                    placeholder=" "
                    className="peer w-full border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
                />
                <label
                    htmlFor="phone"
                    className="absolute left-3 top-2
                    bg-gray-200 px-1
                    text-gray-500 text-sm
                    transition-all 
                    peer-placeholder-shown:top-2
                    peer-placeholder-shown:text-base
                    peer-placeholder-shown:text-gray-400
                    peer-focus:-top-3.5
                    peer-focus:text-md
                    peer-focus:text-gray-500
                    "
                >
                    Phone Number
                </label>
            </div>

            {/* New Password */}
            <div className="relative mb-4">
                <input
                    type="password"
                    id="newPassword"
                    placeholder=" "
                    className="peer w-full border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
                />
                <label
                    htmlFor="newPassword"
                    className="absolute left-3 top-2
                    bg-gray-200 px-1
                    text-gray-500 text-sm
                    transition-all 
                    peer-placeholder-shown:top-2
                    peer-placeholder-shown:text-base
                    peer-placeholder-shown:text-gray-400
                    peer-focus:-top-3.5
                    peer-focus:text-md
                    peer-focus:text-gray-500
                    "
                >
                    New Password
                </label>
            </div>
            {/* Confirm Password */}
            <div className="relative mb-4">
                <input
                    type="password"
                    id="confirmPassword"
                    placeholder=" "
                    className="peer w-full border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
                />
                <label
                    htmlFor="confirmPassword"
                    className="absolute left-3 top-2
                    bg-gray-200 px-1
                    text-gray-500 text-sm
                    transition-all 
                    peer-placeholder-shown:top-2
                    peer-placeholder-shown:text-base
                    peer-placeholder-shown:text-gray-400
                    peer-focus:-top-3.5
                    peer-focus:text-md
                    peer-focus:text-gray-500
                    "
                >
                    Confirm Password
                </label>
            </div>
            
            <button
                type="submit"
                className="w-full bg-gray-600 hover:bg-gray-400 text-white py-2 rounded-lg font-semibold transition duration-200"
            >
                Reset Password
            </button>
            <p className="mt-4 text-sm text-center text-gray-600 font-bold">
                Remember your password?{" "}
                <button
                    type="button"
                    onClick={() => setMode("Sign In")}
                    className="text-blue-600 hover:font-bold font-medium"
                >
                    Sign In
                </button>
            </p>
        </form>
    )
}
