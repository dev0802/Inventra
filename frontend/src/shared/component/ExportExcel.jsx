import * as XLSX from 'xlsx';

export const exportToExcel = (stockData, grandTotal, fromDate, toDate) => {

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d}-${m}-${y}`;
    };

    const from = formatDate(fromDate);
    const to   = formatDate(toDate);

    // ✅ Parse grandTotal safely
    const gt = {
        opMain:  parseFloat(grandTotal.opMain)  || 0,
        opAlt:   parseFloat(grandTotal.opAlt)   || 0,
        inMain:  parseFloat(grandTotal.inMain)  || 0,
        inAlt:   parseFloat(grandTotal.inAlt)   || 0,
        outMain: parseFloat(grandTotal.outMain) || 0,
        outAlt:  parseFloat(grandTotal.outAlt)  || 0,
        clMain:  parseFloat(grandTotal.clMain)  || 0,
        clAlt:   parseFloat(grandTotal.clAlt)   || 0,
    };

    // ✅ Build worksheet manually cell by cell
    const wb = XLSX.utils.book_new();
    const ws = {};

    // Helper to set a cell
    const setCell = (col, row, value, type) => {
        // col = 0-based column index, row = 0-based row index
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        ws[cellRef] = { v: value, t: type || (typeof value === 'number' ? 'n' : 's') };
    };

    // ── ROW 0: Title ──
    setCell(0, 0, `Mana Jewellers Consolidated Summary From ${from} to ${to}`, 's');

    // ── ROW 1: Headers ──
    const headers = [
        "S.No.", "Item Details", "Unit(Main)", "Unit(Alt.)",
        "Op. Qty.(Main)", "Op. Qty.(Alt.)",
        "Qty. In(Main)",  "Qty. In(Alt.)",
        "Qty. Out(Main)", "Qty. Out(Alt.)",
        "Cl. Qty(Main)",  "Cl. Qty(Alt.)"
    ];
    headers.forEach((h, c) => setCell(c, 1, h, 's'));

    // ── ROWS 2+: Data ──
    stockData.forEach((item, i) => {
        const r = i + 2;
        setCell(0,  r, `${i + 1}.`,                      's');
        setCell(1,  r, item.itemDescription,              's');
        setCell(2,  r, item.unitMain,                     's');
        setCell(3,  r, item.unitAlt,                      's');
        setCell(4,  r, parseFloat(item.opQtyMain)  || 0,  'n');
        setCell(5,  r, parseFloat(item.opQtyAlt)   || 0,  'n');
        setCell(6,  r, parseFloat(item.qtyInMain)  || 0,  'n');
        setCell(7,  r, parseFloat(item.qtyInAlt)   || 0,  'n');
        setCell(8,  r, parseFloat(item.qtyOutMain) || 0,  'n');
        setCell(9,  r, parseFloat(item.qtyOutAlt)  || 0,  'n');
        setCell(10, r, parseFloat(item.clQtyMain)  || 0,  'n');
        setCell(11, r, parseFloat(item.clQtyAlt)   || 0,  'n');
    });

    // ── Last ROW: Grand Total ──
    const totalRow = stockData.length + 2;
    setCell(0,  totalRow, '',          's');
    setCell(1,  totalRow, 'Total',     's');
    setCell(2,  totalRow, '',          's');
    setCell(3,  totalRow, '',          's');
    setCell(4,  totalRow, gt.opMain,   'n');
    setCell(5,  totalRow, gt.opAlt,    'n');
    setCell(6,  totalRow, gt.inMain,   'n');
    setCell(7,  totalRow, gt.inAlt,    'n');
    setCell(8,  totalRow, gt.outMain,  'n');
    setCell(9,  totalRow, gt.outAlt,   'n');
    setCell(10, totalRow, gt.clMain,   'n');
    setCell(11, totalRow, gt.clAlt,    'n');

    // ✅ Set worksheet range (required!)
    ws['!ref'] = XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: totalRow, c: 11 }
    });

    // ✅ Merge title row A1:L1
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }
    ];

    // ✅ Column widths
    ws['!cols'] = [
        { wch: 6  },
        { wch: 32 },
        { wch: 12 },
        { wch: 12 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Consolidated Summary");

    XLSX.writeFile(wb, `ConsolidatedSummary_Excel_from_${from}_to_${to}.xlsx`);
};