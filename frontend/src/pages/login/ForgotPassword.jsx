import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { resetPassword } from '../../services/api/auth/authApi';
import { useShowPasswordToggle } from '../../shared/hooks/useShowPassword';
import { useButtonDisable } from '../../shared/hooks/useButtonDisable';
import { validatePhoneNumber, validatePassword } from '../../shared/utilis/Validators';
export default function ForgotPassword({ setMode }) {
    // State variables for form inputs, validation errors, and reset status
    const [phone, setPhone] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassword, togglePassword] = useShowPasswordToggle();
    const [phoneError, setPhoneError] = useState("");
    const [isButtonDisabled, buttonDisableHandler] = useButtonDisable(phone, newPassword);
    // Handler for validating phone number input
    const handlePhoneValidation = (e) => {
        let phoneValue = e.target.value;

        // Remove non-digit characters
        phoneValue = phoneValue.replace(/\D/g, "");

        setPhone(phoneValue);
        setPhoneError(validatePhoneNumber(phoneValue));
        

    };
    // Handler for validating new password input
    const handlePasswordValidation = (e) => {
        let passwordValue = e.target.value;

        setNewPassword(passwordValue);
        setNewPasswordError(validatePassword(passwordValue));
        buttonDisableHandler(passwordValue);
    };
    // Handler for validating confirm password input
    const confirmPasswordValidation = (e) => {
        let value = e.target.value;

        if (value !== newPassword) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError("Passwords match");
        }
        setConfirmPassword(value);
        buttonDisableHandler(value);
    };
    // Handler for form submission to reset the user's password
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(phone.length === 0)
        {
            setPhoneError("Phone Number is required")
            return;
        }
        if(newPassword.length === 0)
        {
            setNewPasswordError("New password is required");
            return;
        }
        if(confirmPassword.length === 0)
        {
            setConfirmPasswordError("Confirm password is required");
            return
        }
        // Call the resetPassword API function with the phone number and new password
        const reset = await resetPassword(phone, newPassword);

        if (reset.message === "User not found") {
            setPhoneError("User not found");
        }
        else if (reset.message === "Password reset successfull") {
            
            setMode("Sign In");
        }
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
            <div className="relative mb-5">
                <input
                    type="text"
                    id="phone"
                    pattern="[0-9]{10}"
                    placeholder=" "
                    value={phone}
                    onChange={handlePhoneValidation}
                    className={`peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none " +
                    ${phoneError === "User not found" || phoneError === "Phone number must be 10 digits long"
                            ? "border-gray-500 shadow-sm shadow-red-500"
                            : phone.length === 10
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
                {phoneError && (
                    <p className='className="text-gray-700 text-sm mt-2 text-center'>{phoneError}</p>
                )}
            </div>

            {/* New Password */}
            <div className="relative mb-5">
                <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder=" "
                    value={newPassword}
                    onChange={handlePasswordValidation}
                    className={`peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none
                        ${newPasswordError === "Password must be 6 characters long" || newPasswordError === "New password is required"
                            ? "border-gray-500 shadow-sm shadow-red-500"
                            :newPassword.length >= 6 
                            ?"border-gray-500 shadow-sm shadow-green-500"
                            :""

                        }
                    
                        `}
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
                    {showPassword ? <AiFillEyeInvisible onClick={togglePassword} /> : <AiFillEye onClick={togglePassword} />}
                </div>
            </div>
            {/* Confirm Password */}
            <div className="relative mb-5">
                <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder=" "
                    value={confirmPassword}
                    onChange={confirmPasswordValidation}
                    className={`peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-transparent focus:border-gray-500 focus:outline-none
                        ${confirmPasswordError === "Passwords match"
                            ? "border-gray-500 shadow-sm shadow-green-500"
                            : confirmPasswordError === "Passwords do not match" || confirmPasswordError === "Confirm password is required"
                                ? "border-gray-500 shadow-sm shadow-red-500"
                                : "border-gray-500 focus:border-gray-500"
                        }
                        `}
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
                    {showPassword ? <AiFillEyeInvisible onClick={togglePassword} /> : <AiFillEye onClick={togglePassword} />}
                </div>
            </div>

            <button
                className="relative w-full py-2 hover:bg-slate-500 font-semibold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed text-white tracking-widest text-lg overflow-hidden bg-gray-700 shadow-md group"
                type="submit"
                disabled={isButtonDisabled}
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
