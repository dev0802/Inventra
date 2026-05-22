const printInvoiceService = require("../services/printInvoiceService");

exports.customerDetail = async (req, res) => {
  try {
    const customerData = req.body;
    const result = await printInvoiceService.customerDetail(customerData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in customerDetail controller:", error);
    if (error.message === "Phone number already exists") {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCustomerByPhone = async (req, res) => {
  try {
    const { phone1Country, phone1 } = req.query;
    const result = await printInvoiceService.getCustomerByPhone(
      phone1Country,
      phone1,
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getCustomerByPhone controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateCustomerDetail = async (req, res) => {
  try {
    const customerData = req.body;
    const result = await printInvoiceService.updateCustomerDetail(customerData);

    if (!result) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in updateCustomerDetail controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getProductByItemCode = async (req, res) => {
  try {
    const { itemCode } = req.query;
    const result = await printInvoiceService.getProductByItemCode(itemCode);
    
    if (!result) {
      return res.status(404).json({ message: "This product is deleted or sold." });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getProductByItemCode controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.saveItemDetail = async (req, res) => {
  try {
    const rows = req.body;
    const result = await printInvoiceService.saveItemDetail(rows);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in saveItemDetail controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.saveInvoice = async(req, res) => {
  const {customer_id, group_code, invoice_date} = req.body;
  if(!customer_id || !group_code || !invoice_date) {
    return res.status(400).json({message: "Missing required fields"});
  }
  try {
    const result = await printInvoiceService.saveInvoice(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in saveInvoice controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getInvoiceById = async (req, res) => {
  try {
    const { invoice_id } = req.params;
    const result = await printInvoiceService.getInvoiceById(invoice_id);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Invoice not found") {
      return res.status(404).json({ message: error.message });
    }
  }
};

exports.getInvoiceByFY = async (req, res) => {
  try {
    const { financial_year } = req.params;
    const result = await printInvoiceService.getInvoiceByFY(financial_year);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getInvoiceByFY controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getInvoiceByNumberAndFY = async (req, res) => {
  try {
    const { invoice_number, financial_year } = req.query;
    const result = await printInvoiceService.getInvoiceByNumberAndFY(invoice_number, financial_year);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Invoice not found")
      return res.status(404).json({ message: error.message });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { invoice_id } = req.params;
    const result = await printInvoiceService.updateInvoice(invoice_id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { invoice_id } = req.params;
    const result = await printInvoiceService.deleteInvoice(invoice_id);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Invoice not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};