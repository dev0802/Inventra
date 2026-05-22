import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const pdfStyles = StyleSheet.create({
  page: { padding: 8, fontSize: 8, fontFamily: "Helvetica" },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },
  subtitle: { fontSize: 8, textAlign: "center", marginBottom: 6 },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  row: { flexDirection: "row" },
  headerCell: {
    backgroundColor: "#e5e7eb",
    fontSize: 6.5,          // 6 → 6.5
    fontWeight: "bold",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 2,
    textAlign: "center",
    minHeight: 24,
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    fontSize: 7,            // 6.5 → 7
    borderColor: "#000",
    padding: 2,
    textAlign: "center",
    minHeight: 14,
  },
  totalRow: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    fontSize: 7,            // 6.5 → 7
    borderColor: "#000",
    padding: 2,
    textAlign: "center",
    minHeight: 14,
    fontWeight: "bold",
    backgroundColor: "#f3f4f6",
  },

colItemCode:        { width: "8%"   },  // same
colItemDescription: { width: "16%"  },  // same
colDate:            { width: "7.5%" },  // 5.85 → 7.5  (2 cols = 15%)
colBool:            { width: "4.5%" },  // 5.85 → 4.5  (2 cols = 9%)
colNumber:          { width: "5.5%" },  // 5.85 → 5.5  (8 cols = 44%)
colColouring:       { width: "7%"   },  // 5.75 → 7%
});

const fmtWeight = (v) =>
  v === "" || v === undefined || v === null ? "" : parseFloat(v).toFixed(3);

const fmtDate = (v) => {
  if (!v) return "";
  try {
    const d = new Date(v);
    if (isNaN(d.getTime())) return String(v);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return String(v);
  }
};

const headers = [
  { label: "Item\nCode",        style: pdfStyles.colItemCode        },
  { label: "Item\nDescription", style: pdfStyles.colItemDescription },
  { label: "Purchased\nDate",   style: pdfStyles.colDate            },
  { label: "Sale\nDate",        style: pdfStyles.colDate            },
  { label: "Sold",              style: pdfStyles.colBool            },
  { label: "Deleted",           style: pdfStyles.colBool            },
  { label: "Net\nWt",           style: pdfStyles.colNumber          },
  { label: "Gross\nWt",         style: pdfStyles.colNumber          },
  { label: "Stone\nWt",         style: pdfStyles.colNumber          },
  { label: "Moti\nWt",          style: pdfStyles.colNumber          },
  { label: "Diamond\nWt",       style: pdfStyles.colNumber          },
  { label: "Solitaire\nWt",     style: pdfStyles.colNumber          },
  { label: "Color\nStone Wt",   style: pdfStyles.colNumber          },
  { label: "Minna\nWt",         style: pdfStyles.colNumber          },
  { label: "Colour-\ning",      style: pdfStyles.colColouring       },
];

export default function ProductListPdf({ loadProducts }) {
  const total = loadProducts.length;

  // sum of all weight columns
  const sum = (key) =>
    loadProducts.reduce((acc, r) => {
      const v = parseFloat(r[key]);
      return acc + (isNaN(v) ? 0 : v);
    }, 0);

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={pdfStyles.page}>
        <Text style={pdfStyles.title}>Mana Jewellers Product List</Text>
        <Text style={pdfStyles.subtitle}>As of {fmtDate(new Date())}</Text>

        <View style={pdfStyles.table}>

          {/* ── Header ── */}
          <View style={pdfStyles.row}>
            {headers.map((h, i) => (
              <Text key={i} style={{ ...pdfStyles.headerCell, ...h.style }}>
                {h.label}
              </Text>
            ))}
          </View>

          {/* ── Data Rows ── */}
          {loadProducts.map((item, index) => (
            <View key={index} style={pdfStyles.row}>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colItemCode }}>
                {item.item_code}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colItemDescription }}>
                {item.item_description}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colDate }}>
                {fmtDate(item.purchased_date)}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colDate }}>
                {fmtDate(item.sale_date)}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colBool }}>
                {item.is_sold ? "Yes" : "No"}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colBool }}>
                {item.is_deleted ? "Yes" : "No"}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colNumber }}>
                {fmtWeight(item.net_weight)}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colNumber }}>
                {fmtWeight(item.gross_weight)}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colNumber }}>
                {fmtWeight(item.stone_weight)}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colNumber }}>
                {fmtWeight(item.moti_weight)}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colNumber }}>
                {fmtWeight(item.diamond_weight)}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colNumber }}>
                {fmtWeight(item.solitaire_weight)}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colNumber }}>
                {fmtWeight(item.color_stone)}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colNumber }}>
                {fmtWeight(item.minna_weight)}
              </Text>
              <Text style={{ ...pdfStyles.cell, ...pdfStyles.colColouring }}>
                {item.colouring}
              </Text>
            </View>
          ))}

          {/* ── Total Row ── */}
          <View style={pdfStyles.row}>
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colItemCode }}>
              Total
            </Text>
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colItemDescription }}>
              {total} items
            </Text>
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colDate }} />
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colDate }} />
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colBool }} />
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colBool }} />
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colNumber }}>
              {fmtWeight(sum("net_weight"))}
            </Text>
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colNumber }}>
              {fmtWeight(sum("gross_weight"))}
            </Text>
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colNumber }}>
              {fmtWeight(sum("stone_weight"))}
            </Text>
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colNumber }}>
              {fmtWeight(sum("moti_weight"))}
            </Text>
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colNumber }}>
              {fmtWeight(sum("diamond_weight"))}
            </Text>
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colNumber }}>
              {fmtWeight(sum("solitaire_weight"))}
            </Text>
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colNumber }}>
              {fmtWeight(sum("color_stone"))}
            </Text>
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colNumber }}>
              {fmtWeight(sum("minna_weight"))}
            </Text>
            <Text style={{ ...pdfStyles.totalRow, ...pdfStyles.colColouring }} />
          </View>

        </View>
      </Page>
    </Document>
  );
}