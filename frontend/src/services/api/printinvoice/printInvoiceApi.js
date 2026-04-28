export const customerDetail = async (customerData) => {
    const response = await fetch(`${process.env.REACT_APP_API_CUSTOMER_DETAIL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

export const getCustomerByPhone = async (phone1Country, phone1) => {
    const response = await fetch(`${process.env.REACT_APP_API_GET_CUSTOMER_BY_PHONE}?phone1Country=${encodeURIComponent(phone1Country)}&phone1=${encodeURIComponent(phone1)}`, {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
        },
    })
    return response.json();
}

export const updateCustomerDetail = async (customerData) => {
    const response = await fetch(`${process.env.REACT_APP_API_UPDATE_CUSTOMER_DETAIL}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
    });
    return response.json();
}

export const getProductByItemCode = async (itemCode) => {
    const response = await fetch(`${process.env.REACT_APP_API_GET_PRODUCT_BY_ITEM_CODE}?itemCode=${encodeURIComponent(itemCode)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export const saveItemDetail = async (rows) => {
    const response = await fetch(`${process.env.REACT_APP_API_SAVE_ITEM_DETAIL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rows),
    });
    return response.json();
}