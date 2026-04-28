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
      return res.status(404).json({ message: "Product not found" });
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
