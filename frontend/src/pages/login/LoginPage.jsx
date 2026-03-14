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
          type="tel"
          pattern="[0-9]{10}"
          maxLength="10"
          inputMode="numeric"
          id="phone"
          placeholder=" "
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

      {/* Password */}
      <div className="relative mb-4">
        <input
          type="password"
          id="password"
          placeholder=" "
          className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
        />
        <label
          htmlFor="password"
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
      {/* <button
        type="submit"
        className="w-full bg-gray-600   text-white py-2 rounded-lg font-semibold transition duration-200 "
        onClick={() => setIsLoggedIn(true)}
      >
        Sign In
      </button> */}
      <button
        className="relative w-full py-2 hover:bg-slate-500 font-semibold rounded-lg text-white tracking-widest text-lg overflow-hidden bg-gray-700 shadow-md group"
        type="submit"
        onClick={() => setIsLoggedIn(true)}
      >
        Sign In

        <span className="absolute top-0 left-0 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:translate-x-full"></span>

        <span className="absolute top-0 left-0 w-[2px] h-0 bg-white transition-all duration-500 group-hover:h-full group-hover:translate-y-full"></span>

        <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:-translate-x-full"></span>

        <span className="absolute bottom-0 right-0 w-[2px] h-0 bg-white transition-all duration-500 group-hover:h-full group-hover:-translate-y-full"></span>

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