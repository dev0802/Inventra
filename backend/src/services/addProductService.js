// Service for adding a new product to the database
const {Pool, withTransaction} = require('../config/database');
// Function to add a new product to the database
exports.addProduct = async (itemCode, itemDescription, grossWeight, stoneWeight, motiWeight, diamondWeight, solitaireWeight, colorStone, minnaWeight, colouring, netWeight, saleDate, hsnCode, isSold, isDeleted) => {
    // Generate a new item code by incrementing the last item code in the database
    return await withTransaction(async (client) => {
    const lastItem = await client.query('Select item_code from productdetail order by product_id desc limit 1');
    const lastItemCode = lastItem.rows.length > 0 ? lastItem.rows[0].item_code : 0;
    const newItemCode =  lastItemCode + 1;
    // Insert the new product into the database
    const addItem = await client.query(
        'INSERT INTO productdetail (item_code, item_description, gross_weight, stone_weight, moti_weight, diamond_weight, solitaire_weight, color_stone, minna_weight, colouring, net_weight, sale_date, hsn_code, is_sold, is_deleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
        [newItemCode, itemDescription, 
        grossWeight,
        stoneWeight || 0,
        motiWeight || 0,
        diamondWeight || 0,
        solitaireWeight || 0,
        colorStone || 0,
        minnaWeight || 0,
        colouring || 0,
        netWeight,
        saleDate || null,
        hsnCode || '7113',
        isSold || false,
        isDeleted || false]
    );
    return {
        message: "Product added successfully",
        product: addItem.rows[0]
    };
});
};

exports.itemDescriptions = async (itemDescription) => {
    const addItemDescription = await Pool.query(
        'INSERT INTO itemdescription(item_description) VALUES($1) RETURNING *',
        [itemDescription]
    );

    return addItemDescription.rows[0];
}

exports.getItemDescriptions=async()=>{
    const getItemDescription = await Pool.query('SELECT * FROM itemdescription');
    return getItemDescription.rows;
}

exports.deleteItemDescription = async (itemDescription) => {
    const result = await Pool.query(
        'DELETE FROM itemdescription WHERE item_description = $1 RETURNING *',
        [itemDescription]
    );
    return result.rows[0];
}

