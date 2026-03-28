import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { logIn } from "../../services/api/auth/authApi";
import { useShowPasswordToggle } from "../../shared/hooks/useShowPassword";
import { validatePassword, validatePhoneNumber } from "../../shared/utilis/Validators";
export default function LoginPage({ setMode, setIsLoggedIn }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneerror, setPhoneError] = useState("");
  const [passworderror, setPasswordError] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [showPassword, togglePassword] = useShowPasswordToggle();

  const navigate = useNavigate();

  const handlePhoneValidation = (e) => {
    let phoneValue = e.target.value;

    // Remove non-digit characters
    phoneValue = phoneValue.replace(/\D/g, "");

    setPhone(phoneValue);
    setPhoneError(validatePhoneNumber(phoneValue));

  };

  const handlePasswordValidation = (e) => {
    let passwordValue = e.target.value;

    setPassword(passwordValue);
    setPasswordError(validatePassword(passwordValue));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phone.length === 0 && password.length === 0) {
      setLoginStatus("Both Fields are empty");
      return;
    }
    else if (phone.length !== 0 && password.length !== 0) {
      setLoginStatus("");
    }

    const logInResponse = await logIn(phone, password);

    if (logInResponse.message === "User not found") {
      setLoginStatus("User not found");
      setPhoneError("Phone number does not exist")
    }
    else if (logInResponse.message === "Invalid Password") {
      setLoginStatus("Invalid Password");
    }
    else if (logInResponse.message === "Login successfull") {
      setIsLoggedIn(true);
      navigate("/main");
      alert("Login successfull");
    }
    else {
      setLoginStatus(logInResponse.message);
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Heading */}
      <div className="text-center lg:text-left mb-6">
        <h2 className="text-2xl text-gray-800 font-bold text-center">
          Sign In
        </h2>
      </div>

      {/* Phone Number */}
      <div className="relative mb-5">
        <input
          type="tel"
          pattern="[0-9]{10}"
          maxLength="10"
          inputMode="numeric"
          id="phone"
          placeholder=" "
          value={phone}
          onChange={handlePhoneValidation}
          className={`peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none " +
            ${phoneerror === "Phone number does not exist" || loginStatus === "Both fields are empty"
              ? "border-gray-500 shadow-sm shadow-red-500"
              : phone.length === 10 && phoneerror !== "Phone number does not exist" 
              ? "border-gray-500 shadow-sm shadow-green-500"
              : ""
            }
      `}
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
        {/* {phoneerror && (
          <p className="text-grey-500 text-sm mt-1">{phoneerror}</p>
        )} */}

      </div>

      {/* Password */}
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder=" "
          value={password}
          onChange={handlePasswordValidation}
          className={`peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none
            ${passworderror === "Password  must be 6 characters long" || loginStatus === "Invalid Password" || loginStatus === "User not found" || loginStatus === "Both fields are empty"
              ? "border-gray-500 shadow-sm shadow-red-500"
              : password.length >= 6
              ? "border-gray-500 shadow-sm shadow-green-500"
              : ""
            }
      `}
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
        {/* {passworderror && (
          <p className="text-grey-500 text-sm mt-1">{passworderror}</p>
        )} */}
        <div
          className="absolute right-3 top-3 cursor-pointer text-gray-700 text-xl"
        >
          {showPassword ? <AiFillEyeInvisible onClick={togglePassword} /> :
            <AiFillEye onClick={togglePassword} />}
        </div>

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

      <button
        className="relative w-full py-2 hover:bg-slate-500 font-semibold rounded-lg text-white tracking-widest text-lg overflow-hidden bg-gray-700 shadow-md group"
        type="submit"

      >
        Sign In

        <span className="absolute top-0 left-0 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:translate-x-full"></span>

        <span className="absolute top-0 left-0 w-[2px] h-0 bg-white transition-all duration-500 group-hover:h-full group-hover:translate-y-full"></span>

        <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:-translate-x-full"></span>

        <span className="absolute bottom-0 right-0 w-[2px] h-0 bg-white transition-all duration-500 group-hover:h-full group-hover:-translate-y-full"></span>

      </button>
      {loginStatus && (
        <p className="text-gray-500 text-sm mt-2 text-center font-bold">
          {loginStatus}
        </p>
      )}
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