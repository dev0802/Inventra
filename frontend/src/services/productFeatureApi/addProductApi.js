export const addProduct = async (productData) => {
    const response = await fetch(`${process.env.REACT_APP_API_ADD_PRODUCT}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify(productData),
    })
    return response.json();
};

export const addItemDescription = async(itemDescription) => {
    const response = await fetch(`${process.env.REACT_APP_API_ADD_ITEM_DESCRIPTION}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify({itemDescription}),
    })
    return response.json();
}

export const getItemDescriptions = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_GET_ITEM_DESCRIPTION}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials:"include",
        
    })
    return response.json();
}

export const deleteItemDescription = async (itemDescription) => {
    const response = await fetch(`${process.env.REACT_APP_API_DELETE_ITEM_DESCRIPTION}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials:"include",
        body: JSON.stringify({ itemDescription }),
    });
    return response.json();
}