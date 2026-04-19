
export const updateProductDetails = async(updateData) => {
    const response = await fetch(`${process.env.REACT_APP_API_UPDATE_PRODUCT}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
    })

    return response.json();
}

export const filterProducts = async(filters) => {
    const response = await fetch(`${process.env.REACT_APP_API_FILTER_PRODUCTS}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
    })
    return response.json();
}

export const getAllProducts = async() => {
    const response = await fetch(`${process.env.REACT_APP_API_GET_ALL_PRODUCTS}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.json();
}