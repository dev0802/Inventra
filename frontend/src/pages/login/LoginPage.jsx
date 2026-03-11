import React from "react";

export default function LoginPage({ setMode, setIsLoggedIn }) {
  return (
    <form>
      {/* Heading */}
      <div className="text-center lg:text-left mb-6">
        <h2 className="text-2xl text-gray-800 font-bold text-center">
          Sign In
        </h2>
      </div>

      {/* Phone Number */}
      <div className="relative mb-4">
        <input
          type="phone"
          id="phone"
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

      {/* Password */}
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

      {/* Forgot Password */}
      <div className="text-right mb-5">
        <button
          type="button"
          className="text-sm text-blue-600 hover:font-bold "
          onClick={() => setMode("Forgot Password")}
        >
          Forgot Password?
        </button>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full bg-gray-600 hover:bg-slate-500  text-white py-2 rounded-lg font-semibold transition duration-200 "
        onClick={() => setIsLoggedIn(true)}
      >
        Sign In
      </button>

      {/* Register */}
      <p className="mt-4 text-sm text-center text-gray-600 font-bold">
        New User?{" "}
        <button
          type="button"
          onClick={() => setMode("Sign Up")}
          className="text-blue-600 hover:font-bold font-medium"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
}