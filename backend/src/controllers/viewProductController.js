const logger = require("../utilis/loggerFile");
const viewProductService = require("../services/viewProductService");

exports.updateProductDetails = async (req, res) => {
  const {
    itemCode,
    itemDescription,
    grossWeight,
    stoneWeight,
    motiWeight,
    diamondWeight,
    solitaireWeight,
    colorStone,
    minnaWeight,
    colouring,
    netWeight,
    saleDate,
    purchasedDate,
    isSold,
    isDeleted,
  } = req.body;
  const parsedSaleDate = saleDate || null;
  logger.info(`Update Product attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | Item Code: ${itemCode}`);
  try {
    const response = await viewProductService.updateProductDetails(
      itemCode,
      itemDescription,
      grossWeight,
      stoneWeight,
      motiWeight,
      diamondWeight,
      solitaireWeight,
      colorStone,
      minnaWeight,
      colouring,
      netWeight,
      purchasedDate,
      parsedSaleDate,
      isSold,
      isDeleted,
    );
    logger.info(`Product updated successfully | User Id: ${req.user.userId} & User: ${req.user.userName} | Item Code: ${itemCode}`);
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Update Product error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.filterProducts = async (req, res) => {
  const filters = req.body;
  logger.info(`Filter Products attempt | User Id: ${req.user.userId} & User: ${req.user.userName} | Filters: ${JSON.stringify(filters)}`);
  try {
    const products = await viewProductService.filterProducts(filters);
    logger.info(`Products filtered successfully`);
    res.status(200).json(products);
  } catch (error) {
    logger.error(`Filter Products error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllProducts = async (req, res) => {
  logger.info(`Get All Products attempt`);
  try {
    const products = await viewProductService.getAllProducts();
    logger.info(
      `All Products fetched successfully | User Id: ${req.user.userId} & User: ${req.user.userName} | Count: ${products.length}`,
    );
    res.status(200).json(products);
  } catch (error) {
    logger.error(`Get All Products error | User Id: ${req.user.userId} & User: ${req.user.userName} | ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// const viewProductService = require('../services/viewProductService')

// exports.updateProductDetails = async (req, res) => {
//     const { itemCode, itemDescription, grossWeight, stoneWeight, motiWeight, diamondWeight, solitaireWeight, colorStone, minnaWeight, colouring, netWeight, saleDate, purchasedDate, isSold, isDeleted } = req.body;

//         const parsedSaleDate = saleDate || null;
//     try {
//         const response = await viewProductService.updateProductDetails(itemCode, itemDescription, grossWeight, stoneWeight, motiWeight, diamondWeight, solitaireWeight, colorStone, minnaWeight, colouring, netWeight, purchasedDate, parsedSaleDate, isSold, isDeleted);
//         res.status(200).json(response);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// exports.filterProducts = async (req, res) => {
//     const filters = req.body;
//      console.log('Filters received:', filters);
//     try {
//         const products = await viewProductService.filterProducts(filters);
//         res.status(200).json(products);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// exports.getAllProducts = async (req, res) => {
//     try {
//         const products = await viewProductService.getAllProducts();
//         res.status(200).json(products);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
