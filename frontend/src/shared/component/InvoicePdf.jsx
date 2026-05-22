// InvoicePdf.jsx — FULL UPDATED FILE
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Svg,
  Path,
  
} from "@react-pdf/renderer";
import logo from "../../assets/images/pdf-logo.jpeg";

const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#000",
    paddingHorizontal: 28,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },

  /* ── HEADER ── */
  headerBand: {
    backgroundColor: "#C8991A",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 7,
    // ✅ Top line
    borderTop: "2pt solid #ffd66e",
    // ✅ Bottom line
    borderBottom: "2pt solid #ffd66e",
    marginBottom: 5,
  },
  logoCircle: {
    width: 38,
    height: 38,
    // backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  shopName: {
    flex: 1,
    textAlign: "center",
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#f03521",
    letterSpacing: 1,
  },

  /* ── SUB-HEADER ── */
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 7.5,
    paddingBottom: 4,
    borderBottom: "1pt solid #bbb",
    marginBottom: 6,
  },

  /* ── BILLED TO + INVOICE META ── */
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  billLabel: { fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 3 },
  billValue: { fontSize: 8.5, marginBottom: 1.5 },
  metaRight: { alignItems: "flex-end" },
  metaLine: { flexDirection: "row", marginBottom: 2 },
  metaKey: { fontFamily: "Helvetica-Bold", fontSize: 8.5, marginRight: 3 },
  metaVal: { fontSize: 8.5 },

  /* ── TABLE — no borders on rows ── */
  table: {
    marginBottom: 4,
    borderTop: "1pt solid #000", // only outer border
    borderBottom: "1pt solid #000",
  },
  thead: {
    flexDirection: "row",
    // backgroundColor: "#f0f0f0",
    borderBottom: "1pt solid #000",
  },
  trow: {
    flexDirection: "row",
    minHeight: 17,
    alignItems: "center",
    // borderBotton: "1pt solid #000",
  },
  trowLast: {
    flexDirection: "row",
    minHeight: 17,
    alignItems: "center",
    borderBottom: "1pt solid #000",
  },

  // Column widths
  cSno: { width: 22, paddingHorizontal: 3, textAlign: "center" },
  cDesc: { flex: 1, paddingHorizontal: 4 },
  cHsn: { width: 40, paddingHorizontal: 3, textAlign: "center" },
  cQty: { width: 62, paddingHorizontal: 3, textAlign: "center" },
  cRate: { width: 38, paddingHorizontal: 3, textAlign: "right" },
  cMakePct: { width: 38, paddingHorizontal: 3, textAlign: "center" },
  cMakeAmt: { width: 42, paddingHorizontal: 3, textAlign: "right" },
  cAmt: { width: 46, paddingHorizontal: 3, textAlign: "right" },

  th: { fontFamily: "Helvetica-Bold", fontSize: 7.5, paddingVertical: 4 },
  td: { fontSize: 8, paddingVertical: 2.5 },
  // bl: { borderLeft: "0.5pt solid #aaa" },

  /* ── TOTALS ── */
  totalsWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 4,
    marginTop: 4,
  },
  goldWtBold: { fontFamily: "Helvetica-Bold", fontSize: 8.5 },
  taxBlock: { alignItems: "flex-end" },
  taxLine: { flexDirection: "row", marginBottom: 2 },
  taxLbl: { fontSize: 8, width: 80, textAlign: "right", marginRight: 6 },
  taxVal: { fontSize: 8, width: 34, textAlign: "right" },
  grandLbl: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    width: 80,
    textAlign: "right",
    marginRight: 6,
  },
  grandVal: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    width: 34,
    textAlign: "right",
  },

  /* ── FOOTER ── */
  footer: { position: "absolute", bottom: 0, left: 28, right: 28 },
  footerDiv: { borderTop: "1pt solid #000", marginTop: 36, marginBottom: 6 },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  footerSub: { fontSize: 7.5, marginTop: 2 },
  termsRow: {
    flexDirection: "row",
    borderTop: "0.5pt solid #ccc",
    paddingTop: 4,
    fontSize: 7,
    gap: 8,
  },
  termsBold: { fontFamily: "Helvetica-Bold" },
  bottomBand: {
    backgroundColor: "#C8991A",
    marginTop: 8,
    paddingVertical: 5,
    alignItems: "center",
  },
  bottomTxt: {
    color: "#f03521",
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    letterSpacing: 0.4,
  },
});

export default function InvoicePdf({
  customerData,
  rows,
  invoiceNumber,
  invoiceDate,
  cgstRate = 1.5,
  sgstRate = 1.5,
}) {
  const PhoneIcon = () => (
    <Svg width="8" height="8" viewBox="0 0 24 24">
      <Path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
        fill="#555"
      />
    </Svg>
  );

  const EmailIcon = () => (
    <Svg width="8" height="8" viewBox="0 0 24 24">
      <Path
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
        fill="#9e1616"
      />
    </Svg>
  );

  const LocationIcon = () => (
    <Svg width="8" height="8" viewBox="0 0 24 24">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill="#bc4242"
      />
    </Svg>
  );

  const name =
    customerData.customer_name ||
    customerData.customerName ||
    customerData.name ||
    "";

  const address = [
    customerData.vpo || customerData.address,
    customerData.address_district || customerData.district,
    customerData.address_state || customerData.state,
    customerData.address_pincode ||
      customerData.pinCode ||
      customerData.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const phone =
    customerData.phone_no1 ||
    customerData.customerPhone ||
    customerData.phone1 ||
    "";

  const email = customerData.email || "";

  const custGstin =
    customerData.customer_gstin || customerData.customerGstin || "";

  // ── invoice date format ──
  const formatDate = (d) => {
    if (!d) return "";
    if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const [year, month, day] = d.split("-");
      return `${day}/${month}/${year}`;
    }
    if (typeof d === "string" && d.includes("/")) return d;
    const date = new Date(d);
    if (isNaN(date)) return String(d);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const normalizedRows = (rows || []).map((row) => ({
    ...row,
    itemDescription: row.item_description || row.itemDescription || "",
    hsnCode: row.hsn_code || row.hsnCode || "",
    quantity: row.quantity || "",
    unit: row.unit || "Gms.",
    rate: row.rate || "",
    makingCharges: row.making_charges || row.makingCharges || "",
    is_main_item: row.is_main_item,
  }));

  // ── compute amounts ──
  const computed = normalizedRows.map((row) => {
    const qty = parseFloat(row.quantity) || 0;
    const rate = parseFloat(row.rate) || 0;
    const baseAmt = qty * rate;
    const makingPct = parseFloat(row.makingCharges) || 0;
    const makingAmt =
      row.unit === "Gms." ? Math.round((baseAmt * makingPct) / 100) : 0;
    const lineTotal = row.unit === "Ct." ? baseAmt : baseAmt + makingAmt;
    return { ...row, baseAmt, makingAmt, lineTotal };
  });

  const subtotal = computed.reduce((s, r) => s + r.lineTotal, 0);
  const cgst = Math.round((subtotal * cgstRate) / 100);
  const sgst = Math.round((subtotal * sgstRate) / 100);
  const grand = subtotal + cgst + sgst;

  const totalGoldWt = normalizedRows
    .filter(
      (r) =>
        r.unit === "Gms." && r.is_main_item !== false && r.unit_price !== false,
    )
    .reduce((s, r) => s + (parseFloat(r.quantity) || 0), 0);

  const placeOfSupply = "Punjab (03)";

  // ── S No counter (sirf main items) ──
  let snoCounter = 0;

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* ── HEADER BAND ── */}
        <View style={S.headerBand}>
          <View style={S.logoCircle}>
            <Image src={logo} style={{ width: 50, height: 50 }} />
          </View>
          <Text style={S.shopName}>MANA JEWELLERS</Text>
        </View>

        {/* ── SUB-HEADER ── */}
        <View style={S.subHeader}>
          <Text>GSTIN: {"03ASRPS4951M1ZO"}</Text>
          {/* Phone */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <PhoneIcon />
            <Text> 9872211117, 9855611117</Text>
          </View>

          {/* Location */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <LocationIcon />
            <Text> Mana Chowk, Jandiala Guru(ASR), Punjab, India</Text>
          </View>

          {/* Email */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <EmailIcon />
            <Text> manajewellers@gmail.com</Text>
          </View>
        </View>

        {/* ── BILLED TO + INVOICE META ── */}
        <View style={S.metaRow}>
          <View>
            <Text style={S.billLabel}>Billed To</Text>
            {/* ✅ Name */}
            {name ? <Text style={S.billValue}>{name}</Text> : null}
            {/* ✅ Full Address */}
            {address ? <Text style={S.billValue}>{address}</Text> : null}
            {/* ✅ Phone */}
            {phone ? <Text style={S.billValue}>{phone}</Text> : null}
            {/* ✅ Email */}
            {email ? <Text style={S.billValue}>{email}</Text> : null}
            {/* ✅ Customer GSTIN */}
            {custGstin ? (
              <Text style={S.billValue}>GSTIN: {custGstin}</Text>
            ) : null}
          </View>

          <View style={S.metaRight}>
            <View style={S.metaLine}>
              <Text style={S.metaKey}>Invoice number:</Text>
              <Text style={S.metaVal}>{invoiceNumber}</Text>
            </View>
            <View style={S.metaLine}>
              <Text style={S.metaKey}>Invoice Date:</Text>
              {/* ✅ Date format fix */}
              <Text style={S.metaVal}>{formatDate(invoiceDate)}</Text>
            </View>
            <View style={S.metaLine}>
              <Text style={S.metaKey}>Place Of Supply:</Text>
              <Text style={S.metaVal}>{placeOfSupply}</Text>
            </View>
          </View>
        </View>

        {/* ── TABLE ── */}
        <View style={S.table}>
          {/* thead */}
          <View style={S.thead}>
            <Text style={[S.th, S.cSno]}>S No.</Text>
            <Text style={[S.th, S.cDesc, S.bl]}>Item Description</Text>
            <Text style={[S.th, S.cHsn, S.bl]}>HSN{"\n"}Code</Text>
            <Text style={[S.th, S.cQty, S.bl]}>Quantity</Text>
            <Text style={[S.th, S.cRate, S.bl]}>Rate</Text>
            <Text style={[S.th, S.cMakePct, S.bl]}>Making{"\n"}Charges %</Text>
            <Text style={[S.th, S.cMakeAmt, S.bl]}>Making{"\n"}Charges Rs</Text>
            <Text style={[S.th, S.cAmt, S.bl]}>Amount (Rs)</Text>
          </View>

          {/* ✅ data rows — no border lines, plain white */}
          {computed.map((row, idx) => {
            const isMain = row.unit_price === true || row.unit_price === "true";
            if (isMain) snoCounter++;
            return (
              <View
                key={row.id || idx}
                style={idx === computed.length - 1 ? S.trowLast : S.trow}
              >
                <Text style={[S.td, S.cSno]}>{isMain ? snoCounter : ""}</Text>
                <Text style={[S.td, S.cDesc, S.bl]}>{row.itemDescription}</Text>
                <Text style={[S.td, S.cHsn, S.bl]}>{row.hsnCode}</Text>
                <Text style={[S.td, S.cQty, S.bl]}>
                  {row.quantity} {row.unit}
                </Text>
                <Text style={[S.td, S.cRate, S.bl]}>{row.rate}</Text>
                <Text style={[S.td, S.cMakePct, S.bl]}>
                  {row.unit === "Ct." ? "" : row.makingCharges || ""}
                </Text>
                <Text style={[S.td, S.cMakeAmt, S.bl]}>
                  {row.unit === "Ct." ? "" : row.makingAmt || ""}
                </Text>
                <Text style={[S.td, S.cAmt, S.bl]}>
                  {Math.round(row.lineTotal)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* ── TOTALS ── */}
        <View style={S.totalsWrap}>
          <View>
            <Text>
              <Text style={S.goldWtBold}>Total Gold Wt</Text>
              {"    "}
              {totalGoldWt.toFixed(3)} Gms.
            </Text>
          </View>
          <View style={S.taxBlock}>
            {cgstRate > 0 && (
              <View style={S.taxLine}>
                <Text style={S.taxLbl}>CGST @ {cgstRate}%</Text>
                <Text style={S.taxVal}>{cgst}</Text>
              </View>
            )}
            {sgstRate > 0 && (
              <View style={S.taxLine}>
                <Text style={S.taxLbl}>SGST @ {sgstRate}%</Text>
                <Text style={S.taxVal}>{sgst}</Text>
              </View>
            )}
            <View style={[S.taxLine, { marginTop: 1 }]}>
              <Text style={S.grandLbl}>Grand Total (Rs)</Text>
              <Text style={S.grandVal}>{grand.toLocaleString("en-IN")}</Text>
            </View>
          </View>
        </View>

        {/* ── FOOTER ── */}
        <View style={S.footer} fixed>
          <View style={S.footerDiv} />
          <View style={S.footerTop}>
            <View>
              <Text style={S.footerSub}>Mana Jewellers</Text>
              <Text style={S.footerSub}>A/C : </Text>
              <Text style={S.footerSub}>IFSC : </Text>
              <Text style={S.footerSub}>JANDIALA GURU</Text>
              <Text style={S.footerSub}>HDFC BANK</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 7 }}>Thank you for Shopping.</Text>
              <Text style={{ fontSize: 7 }}>
                Scan the QR code to connect with us.
              </Text>
            </View>
          </View>
          <View style={S.termsRow}>
            <View style={{ flex: 1 }}>
              <Text style={S.termsBold}>
                Subject to 'AMRITSAR' Jurisdiction only
              </Text>
              <Text style={{ marginTop: 16 }}>Receiver's Signature</Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text>
                100% of Net Weight will be refunded on exchange of Hall Mark
                Jewellery.
              </Text>
              <Text>
                5% deduction is applicable in case of return for money value for
                Hall Mark Jewellery.
              </Text>
              <Text>25% deduction is applicable on Diamond return.</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={S.termsBold}>For Mana Jewellers</Text>
              <Text style={{ marginTop: 20 }}>Auth. Signatory</Text>
            </View>
          </View>
          <View style={S.bottomBand}>
            <Text style={S.bottomTxt}>
              DIAMOND, GOLD AND SILVER HIGH CLASS ORNAMENTS
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
