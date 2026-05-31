import * as XLSX from "xlsx";

export const salesReportToExcel = (salesData, totalSales, fromDate, toDate) => {
  const getUnit = (item) => {
    const desc = item.item_description?.toUpperCase() || "";
    if (desc === "DIAMOND" || desc === "SOLITAIRE") return "Ct.";
    if (item.is_main_item) return "Gms.";
    return "Gms.";
  };
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
  };

  const from = formatDate(fromDate);
  const to = formatDate(toDate);
  const gt = {
    itemsCount: totalSales.itemsCount || 0,
    quantity: parseFloat(totalSales.quantity) || 0,
    amount: parseFloat(totalSales.amount) || 0,
  };

  const wb = XLSX.utils.book_new();
  const ws = {};

  const setCell = (col, row, value, type) => {
    const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
    ws[cellRef] = {
      v: value,
      t: type || (typeof value === "number" ? "n" : "s"),
    };
  };

  // Title
  setCell(0, 0, `Mana Jewellers Sales Report From ${from} to ${to}`, "s");

  const headers = [
    "Date",
    "Invoice No.",
    "Item Description",
    "Quantity",
    "Unit",
    "Price",
    "Amount",
  ];
  
  headers.forEach((h, c) => setCell(c, 1, h, "s"));

  salesData.forEach((item, i) => {
    const r = i + 2;
    setCell(
      0,
      r,
      item.is_main_item && item.date
        ? new Date(item.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "",
      "s",
    );
    setCell(1, r, item.is_main_item ? item.invoice_number : "", "s");
    setCell(2, r, item.item_description, "s");
    setCell(3, r, parseFloat(item.quantity) || 0, "n");
    setCell(4, r, getUnit(item), "s");
    setCell(5, r, parseFloat(item.rate || 0).toFixed(2), "n");
    setCell(6, r, parseFloat(item.single_amount || 0).toFixed(2), "n");
  });

  const totalRow = salesData.length + 2;
  setCell(0, totalRow, `Total items: ${gt.itemsCount} `, "s");
  setCell(3, totalRow, gt.quantity.toFixed(3), "n");
  setCell(6, totalRow, gt.amount.toFixed(2), "n");

  ws["!ref"] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: totalRow, c: 6 },
  });

  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }];

  ws["!cols"] = [
    { wch: 15 }, // Date
    { wch: 15 }, // Invoice No.
    { wch: 40 }, // Item Description
    { wch: 10 }, // Quantity
    { wch: 10 }, // Unit
    { wch: 10 }, // Rate
    { wch: 15 }, // Amount
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
  XLSX.writeFile(wb, `Sales_Report_${from}_to_${to}.xlsx`);
};
