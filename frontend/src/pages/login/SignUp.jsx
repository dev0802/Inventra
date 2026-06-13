import React, { useRef, useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../services/api/auth/authApi';
import { useShowPasswordToggle } from '../../shared/hooks/useShowPassword';
import { useButtonDisable } from '../../shared/hooks/useButtonDisable';
import { validateName, validatePassword, validatePhoneNumber } from '../../shared/utilis/Validators';
export default function SignUp({ setMode, setIsLoggedIn }) {
    // State variables for form inputs, validation errors, and signup status
    // const [name, setName] = useState("");
    // const [phone, setPhone] = useState("");
    // const [password, setPassword] = useState("");

    const signUpInfo = useRef({
        name: "",
        phone:"",
        password:""
    })
    const [phoneerror, setPhoneError] = useState("");
    const [passworderror, setPasswordError] = useState("");
    const [nameerror, setNameError] = useState("");
    const [phoneStatus, setPhoneStatus] = useState("");
    const [showPassword, togglePassword] = useShowPasswordToggle();
    const [isButtonDisabled, buttonDisableHandler] = useButtonDisable(signUpInfo.current.phone, signUpInfo.current.password);
    const [signupError, setSignupError] = useState("");
    const navigate = useNavigate();
    // Handlers for validating name, phone number, and password inputs
    const handleNameValidation = (e) => {
        let nameValue = e.target.value;

        signUpInfo.current.name = nameValue;
        setNameError(validateName(nameValue));
    }
    // Handler for validating phone number input
    const handlePhoneValidation = (e) => {
        let phoneValue = e.target.value;

        // Remove non-digit characters
        phoneValue = phoneValue.replace(/\D/g, "");
        signUpInfo.current.phone = phoneValue;
        setPhoneError(validatePhoneNumber(phoneValue));
        setPhoneStatus("");
    };

    // Handler for validating password input
    const handlePasswordValidation = (e) => {
        const passwordValue = e.target.value;
        signUpInfo.current.password = passwordValue;
        setPasswordError(validatePassword(passwordValue));
        buttonDisableHandler(passwordValue);
    };

    // Handler for form submission to sign up the user
    const handleSubmit = async (e) => {
        // Prevent the default form submission behavior so that page doesn't reload
        e.preventDefault();

        if (signUpInfo.current.phone.length === 0) {
            setPhoneError("Phone number is required");
            return;
        }

        if (signUpInfo.current.name.length === 0) {
            setNameError("Name is required");
            return;
        }

        if (signUpInfo.current.password.length === 0) {
            setPasswordError("Password is required");
            return;
        }

        // Call the signUp API function with the name, phone number, and password

        const signUpResponse = await signUp(signUpInfo.current.name, signUpInfo.current.phone, signUpInfo.current.password);
        if (signUpResponse.message === "Signup successfull") {
            localStorage.setItem("userNameSignup", signUpResponse.user.name);
            setIsLoggedIn(true);
            navigate("/main");
        }
        else if (signUpResponse.message === "Phone Number already exists") {
            setPhoneStatus("Phone number already exists");
            console.log(phoneStatus);
        }
        else {
            setSignupError("All fields are required");
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
                    // ref={signUpInfo.current.name}
                    onChange={handleNameValidation}
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
                    <p className="text-gray-500 text-sm mt-1">{nameerror}</p>
                )}
            </div>
            {/*Phone Number Input */}
            <div className="relative mb-5">
                <input
                    type="text"
                    id="phone"
                    pattern="[0-9]{10}"
                    placeholder=" "
                    // value={phone}
                    // ref={signUpInfo.current.phone}
                    onChange={handlePhoneValidation}
                    className={`peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
                             
                        ${phoneerror === "Phone number must be 10 digits long" || phoneStatus === "Phone number already exists"
                            ? "border-gray-500 shadow-sm shadow-red-500"
                            : signUpInfo.current.phone.length === 10
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
                    // value={password}
                    // ref={signUpInfo.current.password}
                    onChange={handlePasswordValidation}
                    className={`peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none "
                        ${passworderror === "Password must be 6 characters long"
                            ? "border-gray-500 shadow-sm shadow-red-500"
                            : signUpInfo.current.password.length >= 6
                                ? "border-gray-500 shadow-sm shadow-green-500"
                                : ""
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
                    {showPassword ? <AiFillEyeInvisible onClick={togglePassword} /> :
                        <AiFillEye onClick={togglePassword} />}
                </div>
            </div>


            <button
                className="relative w-full py-2 hover:bg-slate-500 font-semibold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed text-white tracking-widest text-lg overflow-hidden bg-gray-700 shadow-md group"
                type="submit"
                disabled={isButtonDisabled}

            >
                Sign Up

                <span className="absolute top-0 left-0 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:translate-x-full"></span>

                <span className="absolute top-0 left-0 w-[2px] h-0 bg-white transition-all duration-500 group-hover:h-full group-hover:translate-y-full"></span>

                <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-full group-hover:-translate-x-full"></span>

                <span className="absolute bottom-0 right-0 w-[2px] h-0 bg-white transition-all duration-500 group-hover:h-full group-hover:-translate-y-full"></span>

            </button>
            {signupError && (
                <p className="text-gray-600 text-sm mt-1 font-bold">{signupError}</p>
            )}
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