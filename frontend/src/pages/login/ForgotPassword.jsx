import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
export default function ForgotPassword({ setMode }) {
    const [phone, setPhone] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneerror, setPhoneError] = useState("");
    // const [passworderror, setPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [phoneStatus, setPhoneStatus] = useState("");

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
            setNewPasswordError("");
        }
        else if (!strongPassword.test(value)) {
            setNewPasswordError(
                "Password must be a combination of [a-z], [A-Z], [0-9] and [@$!%*?&] and must be 8-12 characters long"
            );
        }
        else {
            setNewPasswordError("");
        }
        setNewPassword(value);
    };

    const confirmPasswordValidation = (e) => {
        let value = e.target.value;

        // Limit to 12 characters
        value = value.slice(0, 12);

        if (value !== newPassword) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError("");
        }
        setConfirmPassword(value);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/api/auth/reset-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone_number: phone, new_password: newPassword }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Password reset successful") {
                    alert(data.message);
                    setMode("Sign In");
                }
                else {
                    alert("Error resetting password");
                }
            });
    };

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
                    onChange={phoneValidation}
                    className={`peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none " +
                    ${phoneStatus === "Phone number exists"
                            ? "border-gray-500 shadow-sm shadow-green-300"
                            : phoneStatus === "Phone number does not exist"
                                ? "border-gray-500 shadow-sm shadow-red-300"
                                : "border-gray-500 focus:border-gray-500"
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
                {phoneerror && (
                    <p className="text-gray-700 text-sm mt-2 text-center">{phoneerror}</p>
                )}
            </div>

            {/* New Password */}
            <div className="relative mb-4">
                <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder=" "
                    value={newPassword}
                    onChange={passwordValidation}
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
                {newPasswordError && (
                    <p className="text-gray-700 text-sm mt-2 text-center">{newPasswordError}</p>
                )}
                <div className='absolute right-3 top-3 text-gray-700 cursor-pointer text-xl'>
                    {showPassword ? <AiFillEyeInvisible onClick={showPasswordToggle} /> : <AiFillEye onClick={showPasswordToggle} />}
                </div>
            </div>
            {/* Confirm Password */}
            <div className="relative mb-4">
                <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder=" "
                    value={confirmPassword}
                    onChange={confirmPasswordValidation}
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
                {confirmPasswordError && (
                    <p className="text-gray-700 text-sm mt-2 text-center">{confirmPasswordError}</p>
                )}
                <div className='absolute right-3 top-3 text-gray-700 cursor-pointer text-xl'>
                    {showPassword ? <AiFillEyeInvisible onClick={showPasswordToggle} /> : <AiFillEye onClick={showPasswordToggle} />}
                </div>
            </div>

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
