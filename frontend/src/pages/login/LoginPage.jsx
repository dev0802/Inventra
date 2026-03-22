import React, {useState } from "react";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
export default function LoginPage({ setMode, setIsLoggedIn }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneerror, setPhoneError] = useState("");
  const [passworderror, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  const navigate = useNavigate();
  const showPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const phoneValidation = (e) => {
    let value = e.target.value;

    // Remove non-digit characters
    value = value.replace(/\D/g, "");

    // Limit to 10 digits
    if (value.length >= 10) {
      value = value.slice(0, 10);
    }
    
    if (value.length < 10) {
      setPhoneError("Phone number must be 10 digits long");
    } else {
      setPhoneError("");
    }
    setPhone(value);

    // Check if phone number exists in the database
    fetch("http://localhost:5000/api/auth/check-phone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: value }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.exists) {
          setPhoneStatus("Phone number exists");
        } else {
          setPhoneStatus("Phone number does not exist");
        }
      });
  };

  const passwordValidation = (e) => {
    let value = e.target.value;

    // Limit to 12 characters
    value = value.slice(0, 12);

    const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,12}$/;
    
    // Validation
    if (value.length === 0) {
      setPasswordError("");
    }
    else if (!strongPassword.test(value)) {
      setPasswordError(
        "Password must be a combination of [a-z], [A-Z], [0-9] and [@$!%*?&] and must be 8-12 characters long"
      );
    }
    else {
      setPasswordError("");
    }
    setPassword(value);
      // Check if password is correct for the given phone number
    fetch("http://localhost:5000/api/auth/check-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: phone, password: value }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Password is correct") {
          setPasswordStatus("Password is correct");
        }
        else if (data.message === "User not found") {
          setPasswordStatus("User not found");
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(phone.length === 0 && password.length === 0) {
      setLoginError("Both Fields are empty");
      return;
    }
    else if (phone.length !== 0 && password.length !== 0) {
      setLoginError("");
    }

    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: phone, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Login successful") {
          setIsLoggedIn(true);
          navigate("/main");
          alert(data.message);
        }
        else{
          setLoginError(data.message);
        }
      });
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
      <div className="relative mb-4">
        <input
          type="tel"
          pattern="[0-9]{10}"
          maxLength="10"
          inputMode="numeric"
          id="phone"
          placeholder=" "
          value={phone}
          onChange={phoneValidation}
          className={`peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none " +
            ${phoneStatus === "Phone number exists" 
              ? "border-gray-500 shadow-sm shadow-green-300" 
              : phoneStatus === "Phone number does not exist"
              ? "border-gray-500 shadow-sm shadow-red-300"
              : "border-gray-500 focus:border-gray-500"
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
        {phoneerror && (
          <p className="text-grey-500 text-sm mt-1">{phoneerror}</p>
        )}
        
      </div>

      {/* Password */}
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder=" "
          value={password}
          onChange={passwordValidation}
          className={`peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none
            ${passwordStatus === "Password is correct"
              ? "border-gray-500 shadow-sm shadow-green-300"
              : passwordStatus === "Password is incorrect" || passwordStatus === "User not found"
              ? "border-gray-500 shadow-sm shadow-red-300"
              : "border-gray-500 focus:border-gray-500"
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
        {passworderror && (
          <p className="text-grey-500 text-sm mt-1">{passworderror}</p>
        )}
        <div
          className="absolute right-3 top-3 cursor-pointer text-gray-700 text-xl"
        >
          {showPassword ? <AiFillEyeInvisible onClick={showPasswordToggle} /> : 
          <AiFillEye onClick={showPasswordToggle} />}
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
      {loginError && (
        <p className="text-gray-500 text-sm mt-2 text-center font-bold">
          {loginError}
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