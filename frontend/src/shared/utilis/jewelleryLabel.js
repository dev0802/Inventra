import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

export default function JewelleryLabel({
  itemDescription = "",
  grossWeight     = 0,
  stoneWeight     = 0,
  motiWeight      = 0,
  diamondWeight   = 0,
  solitaireWeight = 0,
  colorStone      = 0,
  minnaWeight     = 0,
  colouring       = 0,
  netWeight       = 0,
  itemCode        = "",
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !itemCode) return;
    JsBarcode(svgRef.current, String(itemCode), {
      format: "CODE128",
      width: 3,
      height: 45,
      displayValue: false,
      margin: 2,
    });
  }, [itemCode]);

  return (
    <div
      className="jewellery-label"
      style={{
        display: "flex",
        flexDirection: "row",
        width: 1024,
        height: 130,
        background: "white",
        fontFamily: "Arial, sans-serif",
        border: "1px solid #aaa",
        boxSizing: "border-box",
        overflow: "hidden",
        printColorAdjust: "exact",
      }}
    >
      {/* ── LEFT: center-aligned weights top, bold Net wt bottom ── */}
      <div
        style={{
          width: 280,
          display: "flex",
          flexDirection: "column",
          padding: "8px 12px 8px 20px",
          boxSizing: "border-box",
        }}
      >
        {/* Center-aligned weight rows */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <WeightRow label="Gross wt (Gm)" value={grossWeight} />
          {stoneWeight     > 0 && <WeightRow label="Stone wt (Gm)"     value={stoneWeight} />}
          {motiWeight      > 0 && <WeightRow label="Moti wt (Gm)"      value={motiWeight} />}
          {diamondWeight   > 0 && <WeightRow label="Diamond wt (Gm)"   value={diamondWeight} />}
          {solitaireWeight > 0 && <WeightRow label="Solitaire wt (Gm)" value={solitaireWeight} />}
          {colorStone      > 0 && <WeightRow label="Color Stone (Gm)"  value={colorStone} />}
          {minnaWeight     > 0 && <WeightRow label="Minna wt (Gm)"     value={minnaWeight} />}
          {colouring       > 0 && <WeightRow label="Colouring (Gm)"    value={colouring} />}
        </div>

        {/* Net wt — bold, pinned to bottom-left */}
        <div
          style={{
            fontSize: 19,
            fontWeight: 800,
            color: "#000",
            whiteSpace: "nowrap",
            lineHeight: 1.6,
            paddingBottom: 2,
          }}
        >
          Net wt (Gm): {Number(netWeight).toFixed(3)}
        </div>
      </div>

      {/* ── RIGHT: barcode+code top, description bottom (same level as Net wt) ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "6px 12px 6px 6px",
          boxSizing: "border-box",
        }}
      >
        {/* Barcode + item code number */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            // justifyContent: "center",
          }}
        >
          <svg ref={svgRef} style={{ display: "block", marginTop: 10 }} />
          <p style={{ fontSize: 16, fontWeight: 800, color: "#111", textAlign: "center", lineHeight: 1.2, margin:0 }}>
            {itemCode}
          </p>
        </div>

        {/* Item description — pinned bottom, same level as Net wt */}
        <p
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: "#000",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            lineHeight: 1.8,
            margin: 0,
            marginTop:1,
            paddingBottom: 4,
          }}
        >
          {itemDescription}
        </p>
      </div>
    </div>
  );
}

function WeightRow({ label, value }) {
  return (
    <div
      style={{
        fontSize: 18,
        fontWeight:400,
        color: "#111",
        textAlign: "center",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {label}: {Number(value).toFixed(3)}
    </div>
  );
}