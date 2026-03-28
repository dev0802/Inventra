import { useState } from "react";

export const useShowPasswordToggle = () => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword(!showPassword);
    }
    return [showPassword, togglePassword];
}