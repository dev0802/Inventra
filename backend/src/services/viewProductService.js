const Pool = require('../config/database');
exports.updateProductDetails = async (itemCode, itemDescription, grossWeight, stoneWeight, motiWeight, diamondWeight, solitaireWeight, colorStone, minnaWeight, colouring, netWeight, purchasedDate,saleDate,isSold, isDeleted) => {
    const result = await Pool.query(
        'UPDATE productdetail SET item_description = $2, gross_weight = $3, stone_weight = $4, moti_weight = $5, diamond_weight = $6, solitaire_weight = $7, color_stone = $8, minna_weight = $9, colouring = $10, net_weight = $11, sale_date = $12, purchased_date = $13, is_sold = $14, is_deleted = $15 WHERE item_code = $1 RETURNING *',
        [itemCode, itemDescription, grossWeight, stoneWeight, motiWeight, diamondWeight, solitaireWeight, colorStone, minnaWeight, colouring, netWeight, saleDate, purchasedDate, isSold, isDeleted]
    );
    return result.rows[0];
};

exports.filterProducts = async (filters) => {
        const conditions = [];
        const values = [];
        let index = 1;

        if (filters.startDate) {
            conditions.push(`purchased_date >= $${index++}`);
            values.push(filters.startDate);
        }
        if (filters.endDate) {
            conditions.push(`purchased_date <= $${index++}`);
            values.push(filters.endDate);
        }
        if (filters.itemDescription) {
            conditions.push(`item_description ILIKE $${index++}`);
            values.push(`%${filters.itemDescription}%`);
        }
        if (filters.itemCode) {
            conditions.push(`item_code = $${index++}`);
            values.push(filters.itemCode);
        }
        if (filters.viewBy === 'Sold') {
            conditions.push(`is_sold = true`);
        }
        if (filters.viewBy === 'Unsold') {
            conditions.push(`is_sold = false`);
        }
        if (filters.viewBy === 'Deleted') {
            conditions.push(`is_deleted = true`);
        }

        const whereClause = conditions.length > 0
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        const result = await Pool.query(
            `SELECT *,
             TO_CHAR(purchased_date, 'YYYY-MM-DD') as purchased_date,
             TO_CHAR(sale_date, 'YYYY-MM-DD') as sale_date
             FROM productdetail ${whereClause} 
             ORDER BY item_code ASC`,
            values
        );
        return result.rows;
};

exports.getAllProducts = async () => {
    const result = await Pool.query(
        `SELECT *, 
         TO_CHAR(purchased_date, 'YYYY-MM-DD') as purchased_date,
         TO_CHAR(sale_date, 'YYYY-MM-DD') as sale_date
         FROM productdetail 
         ORDER BY item_code ASC`
    );
    const distinctDescriptions = [
        ...new Set(result.rows.map(p => p.item_description).filter(Boolean))
    ].sort();
    return {products : result.rows,
        descriptions : distinctDescriptions};
};