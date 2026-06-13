const { Pool, withTransaction } = require("../config/database");
exports.customerDetail = async (customerData) => {
  const phoneNo1 = customerData.phone1Country + customerData.phone1;
  const phoneNo2 = customerData.phone2
    ? customerData.phone2Country + customerData.phone2
    : null;
  const phoneNumberExists = await Pool.query(
    "SELECT * FROM customerdetail WHERE phone_no1 = $1",
    [phoneNo1],
  );
  if (phoneNumberExists.rows.length > 0) {
    throw new Error("Phone number already exists");
  }
  const customer = await Pool.query(
    "INSERT INTO customerdetail (customer_name, phone_no1, phone_no2, birthday, anniversary, email, address, address_state, address_district, address_pincode, customer_gstin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
    [
      customerData.customerName,
      phoneNo1,
      phoneNo2,
      customerData.birthday || null,
      customerData.anniversary || null,
      customerData.email || null,
      customerData.vpo || null,
      customerData.state,
      customerData.district,
      customerData.pinCode,
      customerData.customerGstin,
    ],
  );
  return customer.rows[0];
};

exports.getCustomerByPhone = async (phone1Country, phone1) => {
  const phoneNo1 = phone1Country + phone1;
  console.log("Searching phone:", phoneNo1);
  const customer = await Pool.query(
    `SELECT * FROM customerdetail WHERE phone_no1 = $1`,
    [phoneNo1],
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
      phoneNo1, // WHERE condition
    ],
  );
  return customer.rows[0];
};

exports.getProductByItemCode = async (itemCode) => {
  const result = await Pool.query(
    `SELECT item_description, hsn_code, net_weight, stone_weight, 
                moti_weight, diamond_weight, solitaire_weight, color_stone, colouring, minna_weight
         FROM productdetail 
         WHERE item_code = $1 AND is_deleted = false AND is_sold = false`,
    [itemCode],
  );

  const product = result.rows[0];
  if (!product) return null;

  const weightFields = [
    { key: "net_weight", label: product.item_description },
    { key: "stone_weight", label: "STONES" },
    { key: "moti_weight", label: "MOTI" },
    { key: "diamond_weight", label: "DIAMOND" },
    { key: "solitaire_weight", label: "SOLITAIRE" },
    { key: "color_stone", label: "COLOR STONE" },
    { key: "colouring", label: "COLOURING" },
    { key: "minna_weight", label: "MINNA" },
  ];

  return weightFields
    .filter((field) => product[field.key] > 0)
    .map((field) => ({
      item_description: field.label,
      hsn_code: product.hsn_code,
      net_weight: product[field.key],
    }));
};

exports.saveItemDetail = async (rows) => {
  console.log("RECEIVED ROWS:", JSON.stringify(rows, null, 2));
  console.log("ROWS COUNT:", rows.length);
  const lastItem = await Pool.query(
    "SELECT group_code FROM itemdetail ORDER BY item_id DESC LIMIT 1",
  );
  const lastGroupCode =
    lastItem.rows.length > 0 ? lastItem.rows[0].group_code : 0;
  let groupCode = lastGroupCode;

  const groups = [];
  let currentGroup = [];
  const allGroupCode = [];
  rows.forEach((row) => {
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
    allGroupCode.push(groupCode);
    const itemCode = group[0].itemCode;
    if (itemCode) {
      const today = new Date().toISOString().split("T")[0];
      await Pool.query(
        `UPDATE productdetail SET is_sold = true, sale_date = $1 WHERE item_code = $2`,
        [today, itemCode],
      );
    }

    for (let i = 0; i < group.length; i++) {
      const row = group[i];
      await Pool.query(
        `INSERT INTO itemdetail 
                    (item_description, code, group_code, hsn_code, quantity, unit, rate, unit_price, making_charges)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          row.itemDescription,
          i === 0
            ? row.itemCode
              ? String(groupCode)
              : `Manual_Item_${crypto.randomUUID()}`
            : crypto.randomUUID(),
          groupCode,
          row.hsnCode,
          row.quantity,
          row.unit,
          row.rate || null,
          row.unitPrice,
          row.makingCharges || null,
        ],
      );
    }
  }

  return { message: "Items saved successfully", groupCode, allGroupCode };
};

exports.getFinancialYear = (date = new Date()) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  if (month >= 3) {
    return `${year}-${String(year + 1).slice(-2)}`;
  } else {
    return `${year - 1}-${String(year).slice(-2)}`;
  }
};

exports.getNextInvoiceNumber = async (financial_year, client = null) => {
  const connection = client || Pool;
  const result = await connection.query(
    `SELECT MAX(invoice_number) AS last_number
        FROM printinvoice
        WHERE financial_year = $1`,
    [financial_year],
  );
  const lastNumber = result.rows[0].last_number;
  return lastNumber ? lastNumber + 1 : 1;
};

exports.getNextManualInvoiceNumber = async (financial_year, client = null) => {
  const connection = client || Pool;
  const result = await connection.query(
    `SELECT MAX(invoice_number) AS last_number
     FROM printinvoice
     WHERE financial_year = $1`,
    [financial_year],
  );
  const lastNumber = result.rows[0].last_number;
  return lastNumber ? lastNumber + 1 : 1;
};

exports.saveInvoice = async ({ customer_id, group_code, invoice_date }) => {
  return await withTransaction(async (client) => {
    const custResult = await client.query(
      `SELECT
        customer_name, phone_no1, phone_no2, email, address, address_district, address_state, address_pincode
        FROM customerdetail
        WHERE customer_id = $1`,
      [customer_id],
    );

    if (custResult.rows.length === 0) {
      throw new Error("Customer not found");
    }

    const c = custResult.rows[0];

    const customer = {
      customer_id,
      name: c.customer_name,
      phone_no1: c.phone_no1,
      phone_no2: c.phone_no2 || null,
      email: c.email || null,
      address: c.address,
      address_district: c.address_district,
      address_state: c.address_state,
      address_pincode: c.address_pincode,
    };

    // const itemsResult = await client.query(
    //   `SELECT
    //     item_description, code, group_code, hsn_code, quantity, unit, rate, unit_price, making_charges
    //     FROM itemdetail
    //     WHERE group_code = ANY($1::int[])
    //     ORDER BY item_id ASC`,
    //   [group_code],
    // );
    const itemsResult = await client.query(
  `SELECT
    i.item_description, i.code, i.group_code, i.hsn_code, i.quantity, 
    i.unit, i.rate, i.unit_price, i.making_charges,
    p.item_code as actual_item_code
   FROM itemdetail i
   LEFT JOIN productdetail p ON p.item_code::text = i.code
   WHERE i.group_code = ANY($1::int[])
   ORDER BY i.item_id ASC`,
  [group_code],
);
    if (itemsResult.rows.length === 0) {
      throw new Error("Items Not Found");
    }

    const items = itemsResult.rows.map((row, idx) => {
      const isManual =
        row.code && row.code.toString().startsWith("Manual_Item_");
      const baseAmt =
        row.unit_price === false
          ? row.rate
          : parseFloat(row.quantity) * parseFloat(row.rate);

      return {
        item_description: row.item_description,
        hsn_code: row.hsn_code,
        quantity: row.quantity,
        rate: row.rate,
        unit: row.unit,
        unit_price: row.unit_price,
        making_charges: row.making_charges || null,
        code: row.code || "",
        item_code: row.actual_item_code ? String(row.actual_item_code) : "",
        making_charges_amount:
          row.rate && row.making_charges
            ? Math.round((baseAmt * parseFloat(row.making_charges)) / 100)
            : null,
        amount: Math.round(baseAmt),
        is_main_item: isManual
          ? true
          : !isNaN(Number(row.code)) && row.code !== "",
      };
      console.log("isNaN check:", isNaN(Number(row.code)));
      console.log("CODE VALUE:", row.code, "TYPE:", typeof row.code);
    });
    console.log("Items Data:", JSON.stringify(items, null, 2));

    const totalAmount = items.reduce((sum, item) => {
      return item.is_main_item ? sum + (parseFloat(item.amount) || 0) : sum;
    }, 0);
    const is_manual = items.some((item) =>
      item.code?.toString().startsWith("Manual_Item_"),
    );
    const date = new Date(invoice_date);
    const financial_year = exports.getFinancialYear(date);
    // const invoice_number = await exports.getNextInvoiceNumber(financial_year);
    const invoice_number = is_manual
      ? await exports.getNextManualInvoiceNumber(financial_year)
      : await exports.getNextInvoiceNumber(financial_year);

    const display_number = `${invoice_number}`;

    const result = await client.query(
      `INSERT INTO printinvoice 
    (customer, items, invoice_number, invoice_date, financial_year, total_amount)
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING invoice_id, invoice_number, financial_year, invoice_date `,
      [
        JSON.stringify(customer),
        JSON.stringify(items),
        invoice_number,
        invoice_date,
        financial_year,
        totalAmount,
      ],
    );
    const saved = result.rows[0];
    return {
      invoice_id: saved.invoice_id,
      invoice_number: saved.invoice_number,
      invoice_date: saved.invoice_date,
      financial_year: saved.financial_year,
      display_number: display_number,
      customer: customer,
      items: items,
    };
  });
};

exports.getInvoiceByNumberAndFY = async (invoice_number, financial_year) => {
  console.log("Received:", {
    invoice_number,
    financial_year,
    type: typeof invoice_number,
  });

  const result = await Pool.query(
    `SELECT invoice_id, customer, items, invoice_number, invoice_date, 
            financial_year, total_amount,
            invoice_number
     FROM printinvoice
     WHERE invoice_number = $1 AND financial_year = $2`,
    [Number(invoice_number), financial_year.trim()],
  );

  console.log("Rows found:", result.rows.length);

  if (result.rows.length === 0) throw new Error("Invoice not found");
  return result.rows[0];
};

exports.updateInvoice = async (invoice_number, data) => {
  // 1. Purana invoice fetch karo
  const oldResult = await Pool.query(
    `SELECT items FROM printinvoice WHERE invoice_number = $1`,
    [Number(invoice_number)],
  );
  if (oldResult.rows.length === 0) throw new Error("Invoice not found");

  const oldItems = oldResult.rows[0].items || [];
  const newItems = data.items || [];

  // 2. Valid item codes filter karo (numeric = real product codes)
  const getValidCodes = (items) =>
    items
      .map((i) => i.item_code || i.code)
      .filter(
        (c) =>
          c &&
          String(c).trim() !== "" &&
          !String(c).startsWith("Manual_Item_") &&
          !isNaN(Number(c)),
      )
      .map((c) => Number(c));

  const oldItemCodes = getValidCodes(oldItems);
  const newItemCodes = getValidCodes(newItems);

  console.log("Old codes:", oldItemCodes);
  console.log("New codes:", newItemCodes);

  // 3. Removed items → is_sold = false
  const removedCodes = oldItemCodes.filter((c) => !newItemCodes.includes(c));
  // 4. Added items → is_sold = true
  const addedCodes = newItemCodes.filter((c) => !oldItemCodes.includes(c));

  console.log("Removed:", removedCodes);
  console.log("Added:", addedCodes);

  if (removedCodes.length > 0) {
    await Pool.query(
      `UPDATE productdetail SET is_sold = false, sale_date = null WHERE item_code = ANY($1::integer[])`,
      [removedCodes],
    );
  }

  if (addedCodes.length > 0) {
    const today = new Date().toISOString().split("T")[0];
    await Pool.query(
      `UPDATE productdetail SET is_sold = true, sale_date = $1 WHERE item_code = ANY($2::integer[])`,
      [today, addedCodes],
    );
  }
  console.log("Updating invoice_number:", Number(invoice_number));
  // 5. Invoice update
  const result = await Pool.query(
    `UPDATE printinvoice
     SET customer = $1, items = $2, invoice_date = $3
     WHERE invoice_number = $4
     RETURNING *`,
    [
      JSON.stringify(data.customer),
      JSON.stringify(data.items),
      data.invoice_date,
      Number(invoice_number),
    ],
  );
  console.log("Rows returned:", result.rows.length);
  console.log("Updated invoice:", result.rows[0]);
  if (result.rows.length === 0) throw new Error("Invoice not found");
  return result.rows[0];
};

// exports.deleteInvoice = async (invoice_id) => {
//   const result = await Pool.query(
//     `DELETE FROM printinvoice WHERE invoice_id = $1 RETURNING *`,
//     [Number(invoice_id)],
//   );
//   if (result.rows.length === 0) throw new Error("Invoice not found");
//   return result.rows[0];
// };
// exports.deleteInvoice = async (invoice_id) => {
//   try {
//     const invoiceResult = await Pool.query(
//       `SELECT invoice_number, financial_year, items FROM printinvoice WHERE invoice_id = $1`,
//       [Number(invoice_id)],
//     );

//     if (invoiceResult.rows.length === 0) throw new Error("Invoice not found");

//     const { invoice_number, financial_year, items } = invoiceResult.rows[0];

//     const latestResult = await Pool.query(
//       `SELECT MAX(invoice_number) AS latest FROM printinvoice WHERE financial_year = $1`,
//       [financial_year],
//     );

//     if (Number(invoice_number) !== Number(latestResult.rows[0].latest)) {
//       throw new Error("Only the latest invoice can be deleted");
//     }

//     const itemCodes = items
//       .filter((item) => {
//         const code = item.item_code || item.code;
//         return (
//           code &&
//           String(code).trim() !== "" &&
//           !String(code).startsWith("Manual_Item_") &&
//           !isNaN(Number(code))
//         );
//       })
//       .map((item) => Number(item.item_code || item.code));

//     console.log("Resetting is_sold for item codes:", itemCodes);

//     if (itemCodes.length > 0) {
//       await Pool.query(
//         `UPDATE productdetail 
//      SET is_sold = false, sale_date = null 
//      WHERE item_code = ANY($1::integer[])`,
//         [itemCodes],
//       );
//     }

//     const result = await Pool.query(
//       `DELETE FROM printinvoice WHERE invoice_id = $1 RETURNING *`,
//       [Number(invoice_id)],
//     );

//     return result.rows[0];
//   } catch (err) {
//     console.error("deleteInvoice error:", err.message);
//     throw err;
//   }
// };
exports.deleteInvoice = async (invoice_id) => {
  try {
    const invoiceResult = await Pool.query(
      `SELECT invoice_number, financial_year, items FROM printinvoice WHERE invoice_id = $1`,
      [Number(invoice_id)],
    );

    if (invoiceResult.rows.length === 0) throw new Error("Invoice not found");

    const { invoice_number, financial_year, items } = invoiceResult.rows[0];

    const latestResult = await Pool.query(
      `SELECT MAX(invoice_number) AS latest FROM printinvoice WHERE financial_year = $1`,
      [financial_year],
    );

    if (Number(invoice_number) !== Number(latestResult.rows[0].latest)) {
      throw new Error("Only the latest invoice can be deleted");
    }

    const itemCodes = items
      .filter((item) => {
        const code = item.item_code || item.code;
        return (
          code &&
          String(code).trim() !== "" &&
          !String(code).startsWith("Manual_Item_") &&
          !isNaN(Number(code))
        );
      })
      .map((item) => Number(item.item_code || item.code));

    console.log("Resetting is_sold for item codes:", itemCodes);

    if (itemCodes.length > 0) {
      await Pool.query(
        `UPDATE productdetail 
         SET is_sold = false, sale_date = null 
         WHERE item_code = ANY($1::integer[])`,
        [itemCodes],
      );
    }

    const result = await Pool.query(
      `DELETE FROM printinvoice WHERE invoice_id = $1 RETURNING *`,
      [Number(invoice_id)],
    );

    return result.rows[0];
  } catch (err) {
    console.error("deleteInvoice error:", err.message);
    throw err;
  }
};
exports.generateInvoice = async (rows, invoice_date) => {
  return await withTransaction(async (client) => {
    try {
      const lastResult = await client.query(
        `SELECT general_invoice_number FROM generalinvoice ORDER BY general_invoice_number DESC LIMIT 1`,
      );
      console.log("Last result:", lastResult.rows); // ADD

      const lastNumber = lastResult.rows[0]?.general_invoice_number || 0;
      const generalInvoiceNumber = lastNumber + 1;

      const items = rows
        .map((row) => row.itemDescription || row.item_description || "")
        .join(", ");
      console.log(
        "Items:",
        items,
        "InvoiceNumber:",
        generalInvoiceNumber,
        "Date:",
        invoice_date,
      ); // ADD

      const result = await client.query(
        `INSERT INTO generalinvoice (general_invoice_number, items, total_amount, invoice_date) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
        [generalInvoiceNumber, items, 0, invoice_date],
      );

      return {
        general_invoice_number: result.rows[0].general_invoice_number,
        items: rows,
        invoice_date: result.rows[0].invoice_date,
      };
    } catch (err) {
      console.error("SERVICE ERROR:", err.message); // ADD
      throw err;
    }
  });
};

// exports.generateInvoice = async(rows, invoice_date) => {
//   const lastResult = await Pool.query(
//     `SELECT general_invoice_number FROM generalinvoice ORDER BY general_invoice_number DESC LIMIT 1`
//   );
//   const lastNumber = lastResult.rows[0]?.general_invoice_number || 0;
//   const generalInvoiceNumber = lastNumber + 1;
//   const items = "item : " + rows.map(row => row.item_description).join(", ") + "hsn : " + rows.map(row => row.hsn_code).join(", ") + "quantity : " + rows.map(row => row.quantity).join(", ") + "rate : " + rows.map(row => row.rate).join(", ") + "unit_price : " + rows.map(row => row.unit_price).join(", ") + "making_charges : " + rows.map(row => row.making_charges).join(", ");
//   const result = await Pool.query(
//     `INSERT INTO generalinvoice (general_invoice_number, items, total_amount, invoice_date) VALUES ($1, $2, $3, $4) RETURNING *`,
//     [generalInvoiceNumber, items, 0, invoice_date]
//   );
//   return result.rows[0];
// };
