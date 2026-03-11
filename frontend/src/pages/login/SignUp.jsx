import React from 'react'
export default function SignUp({ setMode, setIsLoggedIn }) {
    return (
        <form>
            {/* Heading */}
            <div className="text-center lg:text-left mb-6">
                <h2 className="text-2xl text-gray-800 font-bold text-center">
                    Sign Up
                </h2>
            </div>
            {/* Name Input */}
            <div className="relative mb-4">
                <input
                    type="text"
                    id="name"
                    placeholder=" "
                    className="peer w-full border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
                />
                <label
                    htmlFor="name"
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
                    Name
                </label>
            </div>
            {/*Phone Number Input */}
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
            {/* Password Input */}
            <div className="relative mb-4">
                <input
                    type="password"
                    id="password"
                    placeholder=" "
                    className="peer w-full border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
                />
                <label
                    htmlFor="password"
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
                    Password
                </label>
            </div>

            <button
                type="submit"
                className="w-full bg-gray-600 hover:bg-gray-400 text-white py-2 rounded-lg font-semibold transition duration-200"
                onClick={() => setIsLoggedIn(true)}
            >

                Sign Up
            </button>
            <p className="mt-4 text-sm text-center text-gray-600 font-bold">
                if you already have an account?{" "}
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
