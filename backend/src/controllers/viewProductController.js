const viewProductService = require('../services/viewProductService')

exports.updateProductDetails = async (req, res) => {
    const { itemCode, itemDescription, grossWeight, stoneWeight, motiWeight, diamondWeight, solitaireWeight, colorStone, minnaWeight, colouring, netWeight, saleDate, purchasedDate, isSold, isDeleted } = req.body;
        
        const parsedSaleDate = saleDate || null;
    try {
        const response = await viewProductService.updateProductDetails(itemCode, itemDescription, grossWeight, stoneWeight, motiWeight, diamondWeight, solitaireWeight, colorStone, minnaWeight, colouring, netWeight, purchasedDate, parsedSaleDate, isSold, isDeleted);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.filterProducts = async (req, res) => {
    const filters = req.body;
     console.log('Filters received:', filters); 
    try {
        const products = await viewProductService.filterProducts(filters);
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await viewProductService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};