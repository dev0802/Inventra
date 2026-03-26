import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../services/api/auth/authApi';
export default function SignUp({ setMode, setIsLoggedIn }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [phoneerror, setPhoneError] = useState("");
    const [passworderror, setPasswordError] = useState("");
    const [nameerror, setNameError] = useState("");
    // const [loginError, setLoginError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [phoneStatus, setPhoneStatus] = useState("");
    // const [phoneValid, setPhoneInValid] = useState(false);
    const [passwordStatus, setPasswordStatus] = useState("");

    const navigate = useNavigate();
    
    const showPasswordToggle = () => {
        setShowPassword(!showPassword);
    };
    
    const nameValidation = (e) => {
        let value = e.target.value;

        if (/^[a-zA-Z\s]*$/.test(value)) {
            setNameError("");
        }
        else {
            setNameError("Only letters and spaces are allowed in the name field");
        }
        setName(value);
    }
    
    const phoneValidation = async (e) => {
        let value = e.target.value;

        // Remove non-digit characters
        value = value.replace(/\D/g, "");

        if (value.length !== 10) {
            setPhoneError("Phone number must be 10 digits long");
        }
        else {
            setPhoneError("")
        }
        setPhone(value);

    };

    const passwordValidation = (e) => {
        let passwordValue = e.target.value;

        // Password greater than or equal to 6 characters
        const passwordLength = /^.{6,}$/;

        // Validation
        if (passwordValue.length === 0) {
            setPasswordError("");
        }
        else if (!passwordLength.test(passwordValue)) {
            setPasswordError("Password  must be 6 characters long");
        }
        else {
            setPasswordError("");
        }
        setPassword(passwordValue);

        if (passwordValue.length >= 6) {
            setPasswordStatus("Password is valid");
        }
        else {
            setPasswordStatus("Password is invalid");
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (phone.length === 0) {
            setPhoneError("Phone number is required");
            return;
        }

        if (name.length === 0) {
            setNameError("Name is required");
            return;
        }

        if (password.length === 0) {
            setPasswordError("Password is required");
            return;
        }

        const signUpResponse = await signUp(name, phone, password);
        if (signUpResponse.message === "Signup successfull") {
            setIsLoggedIn(true);
            navigate("/main");
            alert("Signup successfull");
        }
        else {
            setPhoneStatus("Phone Number already exists");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Heading */}
            <div className="text-center lg:text-left mb-6">
                <h2 className="text-2xl text-gray-800 font-bold text-center">
                    Sign Up
                </h2>
            </div>
            {/* Name Input */}
            <div className="relative mb-5">
                <input
                    type="text"
                    id="name"
                    placeholder=" "
                    value={name}
                    onChange={nameValidation}
                    className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none"
                />
                <label
                    htmlFor="name"
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
                    Name
                </label>
                {nameerror && (
                    <p className="text-grey-500 text-sm mt-1">{nameerror}</p>
                )}
            </div>
            {/*Phone Number Input */}
            <div className="relative mb-5">
                <input
                    type="text"
                    id="phone"
                    pattern="[0-9]{10}"
                    placeholder=" "
                    value={phone}
                    onChange={phoneValidation}
                    className={`peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
                             ${phoneerror === "Phone number must be 10 digits long" || phoneStatus === "Phone Number already exists"
                            ? "border-gray-500 shadow-sm shadow-red-500"
                            : phoneerror === ""
                                ? "border-gray-500 shadow-sm shadow-green-500"
                                : ""
                        }
                            `} />
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
                {phoneerror ? (
                    <p className="text-gray-600 text-sm mt-1">{phoneerror}</p>
                ) : phoneStatus ? (
                    <p className="text-gray-600 text-sm mt-1">{phoneStatus}</p>
                ) : null}

            </div>
            {/* Password Input */}
            <div className="relative mb-4">
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder=" "
                    value={password}
                    onChange={passwordValidation}
                    className={`peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
                              ${passwordStatus === "Password is valid"
                            ? "border-gray-500 shadow-sm shadow-green-500"
                            : passwordStatus === "Password is invalid"
                                ? "border-gray-500 shadow-sm shadow-red-500"
                                : "border-gray-500 focus:border-gray-500"
                        }
                
                `} />
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
                <div className="absolute right-3 top-3 cursor-pointer text-gray-700 text-xl">
                    {showPassword ? <AiFillEyeInvisible onClick={showPasswordToggle} /> :
                        <AiFillEye onClick={showPasswordToggle} />}
                </div>
            </div>


            <button
                className="relative w-full py-2 hover:bg-slate-500 font-semibold rounded-lg text-white tracking-widest text-lg overflow-hidden bg-gray-700 shadow-md group"
                type="submit"

            >
                Sign Up

                <span className="absolute top-0 left-0 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:translate-x-full"></span>

                <span className="absolute top-0 left-0 w-[2px] h-0 bg-white transition-all duration-500 group-hover:h-full group-hover:translate-y-full"></span>

                <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:-translate-x-full"></span>

                <span className="absolute bottom-0 right-0 w-[2px] h-0 bg-white transition-all duration-500 group-hover:h-full group-hover:-translate-y-full"></span>

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