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

exports.addItemDescription = async (req, res) => {
    const { itemDescription } = req.body;
    console.log("Received:", itemDescription);
    try {
        const result = await addProductService.itemDescriptions(itemDescription);
        if (result) {
            return res.status(201).json({ 
                message: "Item description added successfully",
                itemDescription: result.item_description 
            });
        } else {
            return res.status(400).json({ error: 'Failed to add item description' });
        }
    } catch (error) {
        console.error("DB Error:", error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getItemDescriptions = async (req, res) => {
    try {
        const result = await addProductService.getItemDescriptions();
        return res.status(200).json({ 
            itemDescriptions: result.map(r => r.item_description)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.deleteItemDescription = async (req, res) => {
    const { itemDescription } = req.body;
    try {
        const result = await addProductService.deleteItemDescription(itemDescription);
        if (result) {
            return res.status(200).json({ message: "Item description deleted successfully" });
        } else {
            return res.status(404).json({ error: 'Item description not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}