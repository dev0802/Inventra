
export const logIn         = async (phone, password) => {
    const response         = await fetch(`${process.env.REACT_APP_API_LOGIN_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ phoneNumber: phone, userPassword: password }),
    })

    return response.json();
}

export const signUp        = async (name, phone, password) => {
    const response         = await fetch(`${process.env.REACT_APP_API_SIGNUP_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ name: name, phoneNumber: phone, userPassword: password })
    })

    return response.json();
}

export const resetPassword = async (phone, newPassword) => {
    const response         = await fetch(`${process.env.REACT_APP_API_RESET_PASSWORD}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: phone, newUserPassword: newPassword }),
    })

    return response.json();
}

export const verifySession   = async () => {
    const response         = await fetch(`${process.env.REACT_APP_API_VERIFY_SESSION}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
    })
    return response.json();
}

export const logOut         = async () => {
    const response         = await fetch(`${process.env.REACT_APP_API_LOGOUT_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
    })
    return response.json();
}