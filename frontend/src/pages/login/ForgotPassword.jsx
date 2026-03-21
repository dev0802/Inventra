import React, { useState } from 'react'

export default function ForgotPassword({ setMode }) {
    const [phone, setPhone] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/api/auth/reset-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone_number: phone, new_password: newPassword }),
        });
    };

    if (newPassword !== confirmPassword) {
        return (
            <div className="text-center text-red-500 font-bold">
                Passwords do not match
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
                />
                <label
                    htmlFor="phone"
                    className="absolute left-3 -top-3.5
                    bg-gray-200 px-1
                    text-gray-500 text-md
                    transition-all 
                    peer-placeholder-shown:text-base
                    peer-placeholder-shown:text-gray-400
                    peer-placeholder-shown:top-2
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
                />
                <label
                    htmlFor="newPassword"
                    className="absolute left-3 -top-3.5
                    bg-gray-200 px-1
                    text-gray-500 text-md
                    transition-all 
                    peer-placeholder-shown:text-base
                    peer-placeholder-shown:text-gray-400
                    peer-placeholder-shown:top-2
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
                />
                <label
                    htmlFor="confirmPassword"
                    className="absolute left-3 -top-3.5
                    bg-gray-200 px-1
                    text-gray-500 text-md
                    transition-all 
                    peer-placeholder-shown:text-base
                    peer-placeholder-shown:text-gray-400
                    peer-placeholder-shown:top-2
                    peer-focus:-top-3.5
                    peer-focus:text-md
                    peer-focus:text-gray-500
                    "
                >
                    Confirm Password
                </label>
            </div>

            {/* <button
                type="submit"
                className="w-full bg-gray-600 hover:bg-gray-400 text-white py-2 rounded-lg font-semibold transition duration-200"
            >
                Reset Password
            </button> */}

            <button
                className="relative w-full py-2 hover:bg-slate-500 font-semibold rounded-lg text-white tracking-widest text-lg overflow-hidden bg-gray-700 shadow-md group"
                type="submit"
            >
                Reset Password

                <span className="absolute top-0 left-0 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:translate-x-full"></span>

                <span className="absolute top-0 left-0 w-[2px] h-0 bg-white transition-all duration-500 group-hover:h-full group-hover:translate-y-full"></span>

                <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:-translate-x-full"></span>

                <span className="absolute bottom-0 right-0 w-[2px] h-0 bg-white transition-all duration-500                                                                                       group-hover:h-full group-hover:-translate-y-full"></span>

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
