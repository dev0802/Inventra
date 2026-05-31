import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 9, fontFamily: "Helvetica" },
  title: { fontSize: 14, fontWeight: "bold", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 9, textAlign: "center", marginBottom: 12 },
  table: { width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "#000" },
  row: { flexDirection: "row" },
  headerCell: {
    backgroundColor: "#e5e7eb", fontWeight: "bold",
    borderRightWidth: 1, borderBottomWidth: 1,
    borderColor: "#000", padding: 4, textAlign: "center",
  },
  cell: { borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#000", padding: 4, textAlign: "center" },
  lastCell: { borderRightWidth: 0 },
  totalRow: { backgroundColor: "#f3f4f6" },
  boldCell: { fontWeight: "bold" },
  colDate: { width: "20%" },
  colItem: { width: "60%" },
  colNum:  { width: "20%" },
  cellGreen: { backgroundColor: "#86efac" },
  cellRed:   { backgroundColor: "#f87171" },
});

const fmt = (v) =>
  v === "" || v === undefined || v === null ? "" : parseFloat(v).toFixed(3);

const headers = [
  { label: "Date",             style: pdfStyles.colDate },
  { label: "Invoice Number",   style: pdfStyles.colNum  },
  { label: "Item Description", style: pdfStyles.colItem },
  { label: "Quantity",         style: pdfStyles.colNum  },
  { label: "Unit",             style: pdfStyles.colNum  },
  { label: "Rate",             style: pdfStyles.colNum  },
  { label: "Amount",           style: pdfStyles.colNum  },
];

const getUnit = (item) => {
  const desc = item.item_description?.toUpperCase() || '';
  if (desc === 'DIAMOND' || desc === 'SOLITAIRE') return 'Ct.';
  if (item.is_main_item) return 'Gms.';
  return 'Gms.';
};

export default function SalesReportPdf({
  fromDate,
  toDate,
  salesData,
  companyName = "MANA JEWELLERS",
}) {
  const totals = salesData.reduce(
    (acc, item) => ({
      itemsCount: item.is_main_item ? acc.itemsCount + 1 : acc.itemsCount,
      quantity: item.is_main_item
        ? acc.quantity + (parseFloat(item.quantity) || 0)
        : acc.quantity,
      amount: acc.amount + (item.unit_price
        ? (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)
        : (parseFloat(item.rate) || 0)),
    }),
    { itemsCount: 0, quantity: 0, amount: 0 }
  );

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>{companyName}</Text>
        <Text style={pdfStyles.subtitle}>
          Sales Report: From {fromDate} to {toDate}
        </Text>

        <View style={pdfStyles.table}>
          {/* Header */}
          <View style={pdfStyles.row}>
            {headers.map((h, i) => (
              <Text
                key={i}
                style={[
                  pdfStyles.headerCell,
                  h.style,
                  i === headers.length - 1 && pdfStyles.lastCell,
                ]}
              >
                {h.label}
              </Text>
            ))}
          </View>

          {/* Data Rows */}
          {salesData.map((item, index) => {
            const cols = [
              { val: item.is_main_item && item.date ? new Date(item.date).toLocaleDateString('en-IN', { day:'2-digit', month:'2-digit', year:'numeric' }) : '', style: pdfStyles.colDate },
              { val: item.is_main_item ? item.invoice_number : '',   style: pdfStyles.colNum  },
              { val: item.item_description, style: pdfStyles.colItem },
              { val: fmt(item.quantity),    style: pdfStyles.colNum  },
              { val: getUnit(item),         style: pdfStyles.colNum  },
              { val: parseFloat(item.rate   || 0).toFixed(2), style: pdfStyles.colNum },
              { val: parseFloat(item.single_amount || 0).toFixed(2), style: pdfStyles.colNum },
            ];
            return (
              <View key={index} style={pdfStyles.row}>
                {cols.map((col, ci) => (
                  <Text
                    key={ci}
                    style={[
                      pdfStyles.cell,
                      col.style,
                      ci === cols.length - 1 && pdfStyles.lastCell,
                    ]}
                  >
                    {String(col.val ?? "")}
                  </Text>
                ))}
              </View>
            );
          })}

          {/* Total Row */}
          {(() => {
            const totalCols = [
              { val: `Total items: ${totals.itemsCount} `, style: pdfStyles.colDate },
              { val: '',                              style: pdfStyles.colNum  },
              { val: '',                              style: pdfStyles.colItem },
              { val: totals.quantity.toFixed(3),      style: pdfStyles.colNum, bold: true },
              { val: '',                              style: pdfStyles.colNum  },
              { val: '',                              style: pdfStyles.colNum  },
              { val: totals.amount.toFixed(2),        style: pdfStyles.colNum, bold: true },
            ];
            return (
              <View style={[pdfStyles.row, pdfStyles.totalRow]}>
                {totalCols.map((col, ci) => (
                  <Text
                    key={ci}
                    style={[
                      pdfStyles.cell,
                      col.style,
                      col.bold && pdfStyles.boldCell,
                      ci === totalCols.length - 1 && pdfStyles.lastCell,
                    ]}
                  >
                    {String(col.val ?? "")}
                  </Text>
                ))}
              </View>
            );
          })()}
        </View>
      </Page>
    </Document>
  );
}