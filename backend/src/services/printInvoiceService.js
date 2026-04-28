const Pool = require('../config/database');
exports.customerDetail = async(customerData) => {
    const phoneNo1 = customerData.phone1Country + customerData.phone1;
    const phoneNo2 = customerData.phone2 
    ? customerData.phone2Country + customerData.phone2 
    : null;
    const phoneNumberExists = await Pool.query(
        'SELECT * FROM customerdetail WHERE phone_no1 = $1',
        [phoneNo1]
    );
    if (phoneNumberExists.rows.length > 0) {
        throw new Error('Phone number already exists');
    }
    const customer = await Pool.query(
        'INSERT INTO customerdetail (customer_name, phone_no1, phone_no2, birthday, anniversary, email, address, address_state, address_district, address_pincode, customer_gstin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [customerData.customerName, phoneNo1, phoneNo2, customerData.birthday || null, customerData.anniversary||null, customerData.email||null, customerData.vpo||null, customerData.state, customerData.district, customerData.pinCode, customerData.customerGstin]
    );
    return customer.rows[0];

};

exports.getCustomerByPhone = async (phone1Country, phone1) => {
    const phoneNo1 = phone1Country + phone1;
    console.log("Searching phone:", phoneNo1);
    const customer = await Pool.query(
        `SELECT * FROM customerdetail WHERE phone_no1 = $1`,
        [phoneNo1]
    );
    return customer.rows[0];
};

exports.updateCustomerDetail = async (customerData) => {
    const phoneNo1 = customerData.phone1Country + customerData.phone1;
    const phoneNo2 = customerData.phone2 
    ? customerData.phone2Country + customerData.phone2 
    : null;
    const customer = await Pool.query(
        `UPDATE customerdetail SET
            customer_name   = $1,
            phone_no2       = $2,
            birthday        = $3,
            anniversary     = $4,
            address         = $5,
            address_state   = $6,
            address_district = $7,
            address_pincode = $8,
            customer_gstin  = $9
        WHERE phone_no1 = $10
        RETURNING *`,
        [
            customerData.customerName,
            phoneNo2,
            customerData.birthday || null,
            customerData.anniversary || null,
            customerData.vpo || null,
            customerData.state,
            customerData.district,
            customerData.pinCode,
            customerData.customerGstin,
            phoneNo1  // WHERE condition
        ]
    );
    return customer.rows[0];
};

exports.getProductByItemCode = async (itemCode) => {
    const result = await Pool.query(
        `SELECT item_description, hsn_code, gross_weight, stone_weight, 
                moti_weight, diamond_weight, solitaire_weight, color_stone, colouring, minna_weight
         FROM productdetail 
         WHERE item_code = $1 AND is_deleted = false`,
        [itemCode]
    );
    
    const product = result.rows[0];
    if (!product) return null;

    const weightFields = [
        { key: 'gross_weight',     label: product.item_description },
        { key: 'stone_weight',     label: 'STONES' },
        { key: 'moti_weight',      label: 'MOTI' },
        { key: 'diamond_weight',   label: 'DIAMOND' },
        { key: 'solitaire_weight', label: 'SOLITAIRE' },
        { key: 'color_stone',      label: 'COLOR STONE' },
        { key: 'colouring',        label: 'COLOURING' },
        { key: 'minna_weight',     label: 'MINNA' },
    ];

    return weightFields
        .filter(field => product[field.key] > 0)
        .map(field => ({
            item_description: field.label,
            hsn_code: product.hsn_code,
            gross_weight: product[field.key],
        }));
};

exports.saveItemDetail = async (rows) => {
    const lastItem = await Pool.query(
        'SELECT group_code FROM itemdetail ORDER BY item_id DESC LIMIT 1'
    );
    const lastGroupCode = lastItem.rows.length > 0 ? lastItem.rows[0].group_code : 0;
    let groupCode = lastGroupCode;

    const groups = [];
    let currentGroup = [];

    rows.forEach(row => {
        if (row.itemCode) {
            if (currentGroup.length > 0) groups.push(currentGroup);
            currentGroup = [row];
        } else {
            currentGroup.push(row);
        }
    });
    if (currentGroup.length > 0) groups.push(currentGroup);

    for (const group of groups) {
        groupCode += 1;

        for (let i = 0; i < group.length; i++) {
            const row = group[i];
            await Pool.query(
                `INSERT INTO itemdetail 
                    (item_description, code, group_code, hsn_code, quantity, rate, unit_price, making_charges)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    row.itemDescription,
                    i === 0 ? String(groupCode) : crypto.randomUUID(),
                    groupCode,
                    row.hsnCode,
                    row.quantity,
                    row.rate || null,
                    row.unitPrice,
                    row.makingCharges || null
                ]
            );
        }
    }

    return { message: "Items saved successfully", groupCode };
};