import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 9, fontFamily: "Helvetica" },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: { fontSize: 9, textAlign: "center", marginBottom: 12 },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  row: { flexDirection: "row" },
  headerCell: {
    backgroundColor: "#e5e7eb",
    fontWeight: "bold",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 4,
    textAlign: "center",
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 4,
    textAlign: "center",
  },
  lastCell: { borderRightWidth: 0 },
  totalRow: { backgroundColor: "#f3f4f6" },
  boldCell: { fontWeight: "bold" },
  colSno: { width: "4%" },
  colItem: { width: "22%" },
  colUnit: { width: "43%" },
  colNum: { width: "8.5%" },
  cellGreen: { backgroundColor: "#86efac" },
  cellRed: { backgroundColor: "#f87171" },
});

const fmt = (v) =>
  v === "" || v === undefined || v === null ? "" : parseFloat(v).toFixed(3);

const headers = [
  { label: "S.No", style: pdfStyles.colSno },
  { label: "Item Details", style: pdfStyles.colItem },
  { label: "Unit\n(Main)", style: pdfStyles.colNum },
  { label: "Unit\n(Alt)", style: pdfStyles.colNum },
  { label: "Op. Qty.\n(Main)", style: pdfStyles.colNum },
  { label: "Op. Qty.\n(Alt.)", style: pdfStyles.colNum },
  { label: "Qty. In\n(Main)", style: pdfStyles.colNum },
  { label: "Qty. In\n(Alt.)", style: pdfStyles.colNum },
  { label: "Qty. Out\n(Main)", style: pdfStyles.colNum },
  { label: "Qty. Out\n(Alt.)", style: pdfStyles.colNum },
  { label: "Cl. Qty\n(Main)", style: pdfStyles.colNum },
  { label: "Cl. Qty\n(Alt.)", style: pdfStyles.colNum },
];

export default function Pdf({
  fromDate,
  toDate,
  stockData,
  companyName = "MANA JEWELLERS",
}) {
  const totals = stockData.reduce(
    (acc, item) => ({
      opQtyMain: acc.opQtyMain + (parseFloat(item.opQtyMain) || 0),
      opQtyAlt: acc.opQtyAlt + (parseFloat(item.opQtyAlt) || 0),
      qtyInMain: acc.qtyInMain + (parseFloat(item.qtyInMain) || 0),
      qtyInAlt: acc.qtyInAlt + (parseFloat(item.qtyInAlt) || 0),
      qtyOutMain: acc.qtyOutMain + (parseFloat(item.qtyOutMain) || 0),
      qtyOutAlt: acc.qtyOutAlt + (parseFloat(item.qtyOutAlt) || 0),
      clQtyMain: acc.clQtyMain + (parseFloat(item.clQtyMain) || 0),
      clQtyAlt: acc.clQtyAlt + (parseFloat(item.clQtyAlt) || 0),
    }),
    {
      opQtyMain: 0,
      opQtyAlt: 0,
      qtyInMain: 0,
      qtyInAlt: 0,
      qtyOutMain: 0,
      qtyOutAlt: 0,
      clQtyMain: 0,
      clQtyAlt: 0,
    },
  );

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>{companyName}</Text>
        <Text style={pdfStyles.subtitle}>
          Consolidated Summary : From {fromDate} to {toDate}
        </Text>

        <View style={pdfStyles.table}>
          {/* Header Row */}
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
          {stockData.map((item, index) => {
            const cols = [
              { val: index + 1, style: pdfStyles.colSno },
              { val: item.itemDescription, style: pdfStyles.colItem },
              { val: item.unitMain, style: pdfStyles.colNum },
              { val: item.unitAlt, style: pdfStyles.colNum },
              { val: item.opQtyMain, style: pdfStyles.colNum },
              { val: fmt(item.opQtyAlt), style: pdfStyles.colNum },
              {
                val: item.qtyInMain,
                style: pdfStyles.colNum,
                highlight: "green",
              },
              { val: fmt(item.qtyInAlt), style: pdfStyles.colNum },
              {
                val: item.qtyOutMain,
                style: pdfStyles.colNum,
                highlight: "red",
              },
              { val: fmt(item.qtyOutAlt), style: pdfStyles.colNum },
              { val: item.clQtyMain, style: pdfStyles.colNum },
              { val: fmt(item.clQtyAlt), style: pdfStyles.colNum },
            ];
            return (
              <View key={item.id} style={pdfStyles.row}>
                {cols.map((col, ci) => (
                  <Text
                    key={ci}
                    style={[
                      pdfStyles.cell,
                      col.style,
                      col.highlight === "green" && pdfStyles.cellGreen,
                      col.highlight === "red" && pdfStyles.cellRed,
                      ci === cols.length - 1 && pdfStyles.lastCell,
                    ]}
                  >
                    {String(col.val ?? "")}
                  </Text>
                ))}
              </View>
            );
          })}

          {/* Grand Total Row */}
          {(() => {
            const totalCols = [
              { val: "Grand Total", style: pdfStyles.colUnit, bold: true },
              { val: totals.opQtyMain, style: pdfStyles.colNum, bold: true },
              {
                val: totals.opQtyAlt.toFixed(3),
                style: pdfStyles.colNum,
                bold: true,
              },
              {
                val: totals.qtyInMain,
                style: pdfStyles.colNum,
                bold: true,
                highlight: "green",
              },
              {
                val: totals.qtyInAlt.toFixed(3),
                style: pdfStyles.colNum,
                bold: true,
              },
              {
                val: totals.qtyOutMain,
                style: pdfStyles.colNum,
                bold: true,
                highlight: "red",
              },
              {
                val: totals.qtyOutAlt.toFixed(3),
                style: pdfStyles.colNum,
                bold: true,
              },
              { val: totals.clQtyMain, style: pdfStyles.colNum, bold: true },
              {
                val: totals.clQtyAlt.toFixed(3),
                style: pdfStyles.colNum,
                bold: true,
              },
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
                      col.highlight === "green" && pdfStyles.cellGreen,
                      col.highlight === "red" && pdfStyles.cellRed,
                      ci === totalCols.length - 1 && pdfStyles.lastCell,
                    ]}
                  >
                    {col.val}
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
