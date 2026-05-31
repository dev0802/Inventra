const { Pool } = require("../config/database");

exports.getConsolidatedReport = async (fromDate, toDate) => {
  const query = `
        SELECT
            item_description,

            -- Opening: range se pehle purchase, aur ya toh unsold hai
            -- ya range ke BAAD bika (range mein stock mein tha)
            COUNT(*) FILTER (
                WHERE DATE(purchased_date) < $1
                AND is_deleted = false
                AND (is_sold = false OR DATE(sale_date) > $2)
            ) AS op_qty_main,

            COALESCE(SUM(net_weight) FILTER (
                WHERE DATE(purchased_date) < $1
                AND is_deleted = false
                AND (is_sold = false OR DATE(sale_date) > $2)
            ), 0) AS op_qty_alt,

            -- Qty In: range mein purchase hue (sold/unsold dono)
            COUNT(*) FILTER (
                WHERE DATE(purchased_date) BETWEEN $1 AND $2
                AND is_deleted = false
            ) AS qty_in_main,

            COALESCE(SUM(net_weight) FILTER (
                WHERE DATE(purchased_date) BETWEEN $1 AND $2
                AND is_deleted = false
            ), 0) AS qty_in_alt,

            -- Qty Out: range mein bika
            COUNT(*) FILTER (
                WHERE DATE(sale_date) BETWEEN $1 AND $2
                AND is_sold = true
                AND is_deleted = false
            ) AS qty_out_main,

            COALESCE(SUM(net_weight) FILTER (
                WHERE DATE(sale_date) BETWEEN $1 AND $2
                AND is_sold = true
                AND is_deleted = false
            ), 0) AS qty_out_alt

        FROM productdetail
        WHERE is_deleted = false
        GROUP BY item_description
        ORDER BY item_description;
    `;

  const result = await Pool.query(query, [fromDate, toDate]);

  const data = result.rows.map((row, index) => {
    const opMain = parseInt(row.op_qty_main) || 0;
    const opAlt = parseFloat(row.op_qty_alt) || 0;
    const inMain = parseInt(row.qty_in_main) || 0;
    const inAlt = parseFloat(row.qty_in_alt) || 0;
    const outMain = parseInt(row.qty_out_main) || 0;
    const outAlt = parseFloat(row.qty_out_alt) || 0;

    const clMain = opMain + inMain - outMain;
    const clAlt = opAlt + inAlt - outAlt;

    return {
      id: index + 1,
      itemDescription: row.item_description,
      unitMain: "Pcs.",
      unitAlt: "GMS",
      opQtyMain: opMain,
      opQtyAlt: opAlt.toFixed(3),
      qtyInMain: inMain,
      qtyInAlt: inAlt.toFixed(3),
      qtyOutMain: outMain,
      qtyOutAlt: outAlt.toFixed(3),
      clQtyMain: clMain,
      clQtyAlt: clAlt.toFixed(3),
    };
  });

  return data;
};

exports.getSalesReport = async (fromDate, toDate) => {
  const query = `
    SELECT
        DATE(p.invoice_date) AS date,
        p.invoice_number,
        item->>'item_description' AS item_description,
        NULLIF(item->>'quantity', '')::numeric AS quantity,
        NULLIF(item->>'rate', '')::numeric AS rate,
        (NULLIF(item->>'quantity', '')::numeric * NULLIF(item->>'rate', '')::numeric) AS single_amount,
        (item->>'unit_price')::boolean AS unit_price,
        (item->>'is_main_item')::boolean AS is_main_item
    FROM printinvoice p,
    LATERAL jsonb_array_elements(p.items) AS item
    WHERE DATE(p.invoice_date) BETWEEN $1 AND $2
    ORDER BY p.invoice_date, p.invoice_number
`;

  const result = await Pool.query(query, [fromDate, toDate]);
  return result.rows;
};
