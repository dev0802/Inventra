export const customerDetail = async (customerData) => {
    const response = await fetch(`${process.env.REACT_APP_API_CUSTOMER_DETAIL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
    });
    const data = await response.json();
    if (response.status === 409) {
    throw new Error("Phone number already exists");
  }
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
    });
    if (!response.ok) {
        throw new Error('Customer fetch failed');
    }
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

// ── Save Invoice ───────────────────────────────────────────
// Frontend bhejta hai: { customer_id, group_code, invoice_date }
// invoice_number nahi bhejta — backend khud calculate karta hai
export const saveInvoice = async ({ customer_id, group_code, invoice_date }) => {
    const response = await fetch(`${process.env.REACT_APP_API_SAVE_INVOICE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_id, group_code, invoice_date }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Invoice save error');
    }

    return data;
    // Returns: { invoice_id, invoice_number, financial_year, display_number }
};


// ── Get Invoice By ID ──────────────────────────────────────

export const getInvoiceById = async (invoice_id) => {
    const response = await fetch(`${process.env.REACT_APP_API_GET_INVOICE_BY_ID}/${invoice_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Invoice fetch error');
    }

    return data;
    // Returns: { invoice_id, customer{}, items[], display_number, invoice_date, total_amount }
};


// ── Get Invoices By Financial Year ────────────────────────
// List page ke liye — ek FY ki saari invoices
export const getInvoicesByFY = async (financial_year) => {
    const response = await fetch(`${process.env.REACT_APP_API_GET_INVOICES_BY_FY}/${financial_year}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Invoice list fetch error');
    }

    return data;
    // Returns: [ { invoice_id, invoice_number, customer_name, phone_no1, total_amount }... ]
};

export const getInvoiceByNumberAndFY = async (invoice_number, financial_year) => {
    const response = await fetch(`${process.env.REACT_APP_API_GET_INVOICE_BY_NUMBER_AND_FY}?invoice_number=${encodeURIComponent(invoice_number)}&financial_year=${encodeURIComponent(financial_year)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Invoice fetch error');
    }
    return data;
};

export const updateInvoice = async (invoice_id, { customer, items, invoice_date }) => {
    const response = await fetch(`${process.env.REACT_APP_API_UPDATE_INVOICE}/${invoice_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer, items, invoice_date }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Invoice update error');
    }
    return data;
}
export const deleteInvoice = async (invoice_id) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_DELETE_INVOICE}/${invoice_id}`,
    { method: "DELETE", headers: { "Content-Type": "application/json" } }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Delete failed");
  return data;
};