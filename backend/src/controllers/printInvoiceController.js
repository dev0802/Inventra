const logger = require("../utilis/loggerFile");
const printInvoiceService = require("../services/printInvoiceService");

exports.customerDetail = async (req, res) => {
  logger.info(`Customer Detail save attempt | User Id: ${req.user.userId} & User: ${req.user.userName} `);
  try {
    const customerData = req.body;
    const result = await printInvoiceService.customerDetail(customerData);
    logger.info(`Customer Detail saved successfully | User Id: ${req.user.userId} & User: ${req.user.userName} `);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Phone number already exists") {
      logger.error(`Customer Detail failed | User Id: ${req.user.userId} & User: ${req.user.userName} | Phone already exists`);
      return res.status(409).json({ message: error.message });
    }
    logger.error(`Customer Detail error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCustomerByPhone = async (req, res) => {
  const { phone1Country, phone1 } = req.query;
  logger.info(`Get Customer attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | Phone: ${phone1Country}-${phone1}`);
  try {
    const result = await printInvoiceService.getCustomerByPhone(
      phone1Country,
      phone1,
    );
    logger.info(
      `Customer fetched successfully | User Id: ${req.user.userId} & User: ${req.user.userName} | Phone: ${phone1Country}-${phone1}`,
    );
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Get Customer error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateCustomerDetail = async (req, res) => {
  logger.info(`Update Customer Detail attempt | User Id: ${req.user.userId} & User: ${req.user.userName}`);
  try {
    const customerData = req.body;
    const result = await printInvoiceService.updateCustomerDetail(customerData);
    if (!result) {
      logger.error(`Update Customer failed | User Id: ${req.user.userId} & User: ${req.user.userName} | Customer not found`);
      return res.status(404).json({ message: "Customer not found" });
    }
    logger.info(`Customer Detail updated successfully | User Id: ${req.user.userId} & User: ${req.user.userName}`);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Update Customer error | ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getProductByItemCode = async (req, res) => {
  const { itemCode } = req.query;
  logger.info(`Get Product attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | Item Code: ${itemCode}`);
  try {
    const result = await printInvoiceService.getProductByItemCode(itemCode);
    if (!result) {
      logger.error(`Product not  | User Id: ${req.user.userId} & User: ${req.user.userName} | Item Code: ${itemCode}`);
      return res
        .status(404)
        .json({ message: "This product is deleted or sold." });
    }
    logger.info(`Product fetched | User Id: ${req.user.userId} & User: ${req.user.userName} | Item Code: ${itemCode}`);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Get Product | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.saveItemDetail = async (req, res) => {
  logger.info(`Save Item Detail | User Id: ${req.user.userId} & User: ${req.user.userName}`);
  try {
    const rows = req.body;
    const result = await printInvoiceService.saveItemDetail(rows);
    logger.info(`Item Detail saved successfully | User Id: ${req.user.userId} & User: ${req.user.userName}`);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Save Item Detail error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.saveInvoice = async (req, res) => {
  const { customer_id, group_code, invoice_date } = req.body;
  logger.info(
    `Save Invoice attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | Customer ID: ${customer_id} | Date: ${invoice_date}`,
  );
  if (!customer_id || !group_code || !invoice_date) {
    logger.error(`Save Invoice failed | User Id: ${req.user.userId} & User: ${req.user.userName} | Missing required fields`);
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const result = await printInvoiceService.saveInvoice(req.body);
    logger.info(`Invoice saved successfully | User Id: ${req.user.userId} & User: ${req.user.userName}`);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Save Invoice error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getInvoiceById = async (req, res) => {
  const { invoice_id } = req.params;
  logger.info(`Get Invoice attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | Invoice ID: ${invoice_id}`);
  try {
    const result = await printInvoiceService.getInvoiceById(invoice_id);
    logger.info(`Invoice fetched successfully | User Id: ${req.user.userId} & User: ${req.user.userName} | Invoice ID: ${invoice_id}`);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Invoice not found") {
      logger.error(`Invoice not found | User Id: ${req.user.userId} & User: ${req.user.userName} | Invoice ID: ${invoice_id}`);
      return res.status(404).json({ message: error.message });
    }
    logger.error(`Get Invoice error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getInvoiceByFY = async (req, res) => {
  const { financial_year } = req.params;
  logger.info(`Get Invoices by FY attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | FY: ${financial_year}`);
  try {
    const result = await printInvoiceService.getInvoiceByFY(financial_year);
    logger.info(`Invoices fetched successfully | User Id: ${req.user.userId} & User: ${req.user.userName} | FY: ${financial_year}`);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Get Invoices by FY error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getInvoiceByNumberAndFY = async (req, res) => {
  const { invoice_number, financial_year } = req.query;
  logger.info(
    `Get Invoice by Number attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | Invoice: ${invoice_number} | FY: ${financial_year}`,
  );
  try {
    const result = await printInvoiceService.getInvoiceByNumberAndFY(
      invoice_number,
      financial_year,
    );
    logger.info(`Invoice fetched successfully | User Id: ${req.user.userId} & User: ${req.user.userName} | Invoice: ${invoice_number}`);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Invoice not found") {
      logger.error(
        `Invoice not found | User Id: ${req.user.userId} & User: ${req.user.userName} | Invoice: ${invoice_number} | FY: ${financial_year}`,
      );
      return res.status(404).json({ message: error.message });
    }
    logger.error(`Get Invoice by Number error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateInvoice = async (req, res) => {
  const { invoice_number } = req.params;
  logger.info(`Update Invoice attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | Invoice: ${invoice_number}`);
  try {
    const result = await printInvoiceService.updateInvoice(
      invoice_number,
      req.body,
    );
    logger.info(`Invoice updated successfully | User Id: ${req.user.userId} & User: ${req.user.userName} | Invoice: ${invoice_number}`);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Update Invoice error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteInvoice = async (req, res) => {
  const { invoice_id } = req.params;
  logger.info(`Delete Invoice attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | Invoice ID: ${invoice_id}`);
  try {
    const result = await printInvoiceService.deleteInvoice(invoice_id);
    logger.info(`Invoice deleted successfully | User Id: ${req.user.userId} & User: ${req.user.userName} | Invoice ID: ${invoice_id}`);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Invoice not found") {
      logger.error(`Invoice not found | User Id: ${req.user.userId} & User: ${req.user.userName} | Invoice ID: ${invoice_id}`);
      return res.status(404).json({ message: error.message });
    }
    logger.error(`Delete Invoice error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.generateInvoice = async (req, res) => {
  const { invoice_date } = req.body;
  logger.info(`Generate Invoice attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | Date: ${invoice_date}`);
  try {
    const { rows } = req.body;
    const result = await printInvoiceService.generateInvoice(
      rows,
      invoice_date,
    );
    logger.info(`Invoice generated successfully | User Id: ${req.user.userId} & User: ${req.user.userName} | Date: ${invoice_date}`);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Invoice not found") {
      logger.error(`Generate Invoice failed | User Id: ${req.user.userId} & User: ${req.user.userName} | Invoice not found`);
      return res.status(404).json({ message: error.message });
    }
    logger.error(`Generate Invoice error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const printInvoiceService = require("../services/printInvoiceService");

// exports.customerDetail = async (req, res) => {
//   try {
//     const customerData = req.body;
//     const result = await printInvoiceService.customerDetail(customerData);
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error in customerDetail controller:", error);
//     if (error.message === "Phone number already exists") {
//       return res.status(409).json({ message: error.message });
//     }
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.getCustomerByPhone = async (req, res) => {
//   try {
//     const { phone1Country, phone1 } = req.query;
//     const result = await printInvoiceService.getCustomerByPhone(
//       phone1Country,
//       phone1,
//     );
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error in getCustomerByPhone controller:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.updateCustomerDetail = async (req, res) => {
//   try {
//     const customerData = req.body;
//     const result = await printInvoiceService.updateCustomerDetail(customerData);

//     if (!result) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error in updateCustomerDetail controller:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.getProductByItemCode = async (req, res) => {
//   try {
//     const { itemCode } = req.query;
//     const result = await printInvoiceService.getProductByItemCode(itemCode);

//     if (!result) {
//       return res.status(404).json({ message: "This product is deleted or sold." });
//     }
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error in getProductByItemCode controller:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.saveItemDetail = async (req, res) => {
//   try {
//     const rows = req.body;
//     const result = await printInvoiceService.saveItemDetail(rows);
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error in saveItemDetail controller:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.saveInvoice = async(req, res) => {
//   const {customer_id, group_code, invoice_date} = req.body;
//   if(!customer_id || !group_code || !invoice_date) {
//     return res.status(400).json({message: "Missing required fields"});
//   }
//   try {
//     const result = await printInvoiceService.saveInvoice(req.body);
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error in saveInvoice controller:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// exports.getInvoiceById = async (req, res) => {
//   try {
//     const { invoice_id } = req.params;
//     const result = await printInvoiceService.getInvoiceById(invoice_id);
//     return res.status(200).json(result);
//   } catch (error) {
//     if (error.message === "Invoice not found") {
//       return res.status(404).json({ message: error.message });
//     }
//   }
// };

// exports.getInvoiceByFY = async (req, res) => {
//   try {
//     const { financial_year } = req.params;
//     const result = await printInvoiceService.getInvoiceByFY(financial_year);
//     return res.status(200).json(result);
//   } catch (error) {
//     console.error("Error in getInvoiceByFY controller:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// exports.getInvoiceByNumberAndFY = async (req, res) => {
//   try {
//     const { invoice_number, financial_year } = req.query;
//     const result = await printInvoiceService.getInvoiceByNumberAndFY(invoice_number, financial_year);
//     res.status(200).json(result);
//   } catch (error) {
//     if (error.message === "Invoice not found")
//       return res.status(404).json({ message: error.message });
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.updateInvoice = async (req, res) => {
//   try {
//     const { invoice_number } = req.params;
//     const result = await printInvoiceService.updateInvoice(invoice_number, req.body);
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("UPDATE INVOICE ERROR:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.deleteInvoice = async (req, res) => {
//   try {
//     const { invoice_id } = req.params;
//     const result = await printInvoiceService.deleteInvoice(invoice_id);
//     res.status(200).json(result);
//   } catch (error) {
//     if (error.message === "Invoice not found") {
//       return res.status(404).json({ message: error.message });
//     }
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.generateInvoice = async (req, res) => {
//   try {
//     const { rows, invoice_date} = req.body;
//     console.log("REQ BODY:", JSON.stringify(req.body, null, 2));
//     const result = await printInvoiceService.generateInvoice(rows, invoice_date);
//     res.status(200).json(result);
//   } catch (error) {
//     if (error.message === "Invoice not found") {
//       return res.status(404).json({ message: error.message });
//     }
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
