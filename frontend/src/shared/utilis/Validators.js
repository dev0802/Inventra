// commmon validations logics that has been used in components
export const validateName = (nameValue) => {
    if (nameValue.length === 0) {
        return "";
    }
    else if (!/^[a-zA-Z\s]*$/.test(nameValue)) {
        return "Only letters and spaces are allowed in the name field";
    }
    return "";
}

export const validatePhoneNumber = (phoneValue) => {
    if (phoneValue.length === 0) {
        return "";
    }
    else if (phoneValue.length !== 10) {
        return "Phone number must be 10 digits long";
    }
    return "";
}

export const validatePassword = (passwordValue) => {
    
    const passwordLength = /^.{6,}$/;
    // Validation
    if (passwordValue.length === 0) {
        return "";
    }
    else if (!passwordLength.test(passwordValue)) {
        return "Password must be at least 6 characters long";
    }
    return "";
}
