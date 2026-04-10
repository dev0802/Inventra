// Controller for adding a new product to the database
const addProductService = require('../services/addProductService');

exports.addProduct = async (req, res) => {
    const { itemCode, itemDescription, grossWeight, stoneWeight, motiWeight, diamondWeight, solitaireWeight, colorStone, minnaWeight, colouring, netWeight, saleDate, hsnCode, isSold, isDeleted } = req.body;
    try{
        const product = await addProductService.addProduct(itemCode, itemDescription, grossWeight, stoneWeight, motiWeight, diamondWeight, solitaireWeight, colorStone, minnaWeight, colouring, netWeight, saleDate, hsnCode, isSold, isDeleted);
        if(product.message === "Product added successfully"){
            return res.status(201).json(product);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}