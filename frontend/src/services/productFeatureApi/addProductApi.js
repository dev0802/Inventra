export const addProduct = async (productData) => {
    const response = await fetch(`${process.env.REACT_APP_API_ADD_PRODUCT}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
    })
    return response.json();
};