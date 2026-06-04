import React, { useState } from "react";
import NotificationModal from "../../shared/utilis/notificationModal";
import { pdf } from "@react-pdf/renderer";
import Pdf from "../../shared/component/Pdf";
import SalesReportPdf from "../../shared/component/SalesReportPdf";
import {
  getConsolidatedReport,
  getSalesReport,
} from "../../services/api/report/reportApi";
import { exportToExcel } from "../../shared/component/ExportExcel";
import {salesReportToExcel} from "../../shared/component/SalesReportExcel";

export default function Report() {
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  // const [activeTab, setActiveTab] = useState("Stock Report");
  const today = new Date().toISOString().split("T")[0];
  const [dateRange, setDateRange] = useState({
    fromDate: today,
    toDate: today,
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const [showSalesReport, setShowSalesReport] = useState(false);

  const [stockData, setStockData] = useState([
    {
      id: 1,
      itemDescription: "",
      unitMain: "Gms.",
      unitAlt: "Pcs.",
      opQtyMain: "",
      opQtyAlt: "",
      qtyInMain: "",
      qtyInAlt: "",
      qtyOutMain: "",
      qtyOutAlt: "",
      clQtyMain: "",
      clQtyAlt: "",
    },
  ]);

  const [salesData, setSalesData] = useState([]);

  const showNotification = (type, title, message) => {
    setNotification({ isOpen: true, type, title, message });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const totalSum = stockData.reduce(
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
  
  const totalSales = salesData.reduce(
    (acc, item) => ({
        itemsCount: item.is_main_item ? acc.itemsCount + 1 : acc.itemsCount,
        quantity: acc.quantity + (parseFloat(item.quantity) || 0),
        amount: acc.amount + (item.unit_price
            ? (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)
            : (parseFloat(item.rate) || 0)),
    }),
    {
        itemsCount: 0,
        quantity: 0,
        amount: 0,
    },
);
  
const handleExportToExcel = () => {
    if (!stockData.length) {
      showNotification("error", "Error", "No data to export!");
      return;
    }
    exportToExcel(stockData, totalSum, dateRange.fromDate, dateRange.toDate);
    // showNotification("success", "Success", "Excel downloaded successfully!");
  };

  const handleSalesReportToExcel = async() => {
    if(!salesData.length){
      showNotification("error", "Error", "No data to export!");
      return;
    }

    salesReportToExcel(salesData, totalSales, dateRange.fromDate, dateRange.toDate)
  }
  const handleShowSalesReport = async () => {
    if (new Date(dateRange.fromDate) > new Date(dateRange.toDate)) {
      showNotification("error", "Error", "From Date cannot be after To Date!");
      return;
    }
    try {
      const res = await getSalesReport(dateRange.fromDate, dateRange.toDate);
      if (res.success) {
        setSalesData(res.data);
        setShowSalesReport(true);
      } else {
        showNotification(
          "error",
          "Error",
          res.error || "Failed to fetch sales report data.",
        );
      }
    } catch (err) {
      console.error(err);
      showNotification(
        "error",
        "Error",
        "An error occurred while fetching sales report data.",
      );
    }
  };

  
  const handleGenerateReport = async () => {
    if (!dateRange.fromDate || !dateRange.toDate) {
      showNotification(
        "error",
        "Error",
        "Please select both From and To dates!",
      );
      return;
    }
    if (new Date(dateRange.fromDate) > new Date(dateRange.toDate)) {
      showNotification("error", "Error", "From Date cannot be after To Date!");
      return;
    }

    try {
      const res = await getConsolidatedReport(
        dateRange.fromDate,
        dateRange.toDate,
      );
      if (res.success) {
        setStockData(res.data);
        console.log("Sales Report Data:", res.data);
        setShowSalesReport(false);
      } else {
        showNotification(
          "error",
          "Error",
          res.error || "Failed to fetch report data.",
        );
      }
    } catch (err) {
      console.error(err);
      showNotification(
        "error",
        "Error",
        "An error occurred while fetching report data.",
      );
    }

  };
  const handleSalesReportPdf = async() => {
    if (!salesData.length) {
      showNotification("error", "Error", "No data to export!");
    }
    try{
      const blob = await pdf(
        <SalesReportPdf
        fromDate={formatDate(dateRange.fromDate)}
        toDate={formatDate(dateRange.toDate)}
        salesData={salesData}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Sales Report from ${dateRange.fromDate} to ${dateRange.toDate}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      showNotification("error", "Error", "Failed to generate PDF.");
    }
  }
  const handleDownloadPdf = async () => {
    if (!stockData.length) {
      showNotification("error", "Error", "No data to export!");
      return;
    }
    try {
      const blob = await pdf(
        <Pdf
          fromDate={dateRange.fromDate}
          toDate={dateRange.toDate}
          stockData={stockData}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ConsolidatedSummary_${dateRange.fromDate}_${dateRange.toDate}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      // showNotification("success", "Success", "PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      showNotification("error", "Error", "Failed to generate PDF.");
    }
  };

  return (
    <div className="w-full">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
      <div className="flex-1 bg-gray-200 shadow-lg shadow-gray-600 backdrop-blur-md border border-gray-400 rounded-2xl p-6 w-full mx-auto">
        <div key="stock" className=" flex flex-col gap-6">
          {/* Date Range Filter */}
          <div className=" flex flex-wrap gap-4 items-end justify-center">
            <div className="relative">
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                value={dateRange.fromDate}
                onChange={handleDateChange}
                className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
              />
              <label
                htmlFor="fromDate"
                className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
              >
                From Date
              </label>
            </div>

            <div className="relative">
              <input
                type="date"
                id="toDate"
                name="toDate"
                value={dateRange.toDate}
                onChange={handleDateChange}
                className="peer w-full focus:shadow-md border border-gray-500 rounded-md px-3 py-2 bg-gray-200 focus:border-gray-500 focus:outline-none"
              />
              <label
                htmlFor="toDate"
                className="absolute left-3 -top-3.5 bg-gray-200 px-1 text-gray-700 text-md pointer-events-none transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-md peer-focus:text-gray-600"
              >
                To Date
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleGenerateReport}
                className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                View Consolidated Report
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShowSalesReport}
                className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                View Sales Report
              </button>
            </div>
          </div>
          <div className="bg-gray-300 text-gray-700 p-3 rounded-md shadow-inner">
            <h2 className="text-xl font-bold text-gray-800 text-center">
              {showSalesReport ? "Sales Report" : "Consolidated Report"}
            </h2>
            </div>
          {/* Stock Report Table */}
          {!showSalesReport && (
            <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
              <table className="w-full text-sm min-w-[1200px] border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-300 text-gray-700">
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      S.No.
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Item Description
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Unit (Main)
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Unit (Alt.)
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Op. Qty. (Main)
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Op. Qty. (Alt.)
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Qty. In (Main)
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Qty. In (Alt.)
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Qty. Out (Main)
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Qty. Out (Alt.)
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Cl. Qty. (Main)
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Cl. Qty. (Alt.)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stockData.map((item, index) => (
                    <tr key={item.id} className="bg-white hover:bg-gray-50">
                      <td className="p-3 border border-gray-400 text-center">
                        {index + 1}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {item.itemDescription}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {item.unitMain}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {item.unitAlt}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {item.opQtyMain}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {item.opQtyAlt}
                      </td>
                      <td className="p-3 border border-gray-400 bg-green-100 text-center">
                        {item.qtyInMain}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {item.qtyInAlt}
                      </td>
                      <td className="p-3 border border-gray-400 bg-red-100 text-center">
                        {item.qtyOutMain}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {item.qtyOutAlt}
                      </td>
                      <td className="p-3 border border-gray-400 bg-gray-300 text-center font-semibold">
                        {item.clQtyMain}
                      </td>
                      <td className="p-3 border border-gray-400 text-center font-semibold">
                        {item.clQtyAlt}
                      </td>
                      {/* <td className="p-3 border border-gray-400 text-center font-semibold"/> */}
                    </tr>
                  ))}
                  <tr className="bg-gray-100 sticky bottom-0 z-10">
                    <td
                      colSpan="4"
                      className="p-3 border border-gray-400 text-center font-bold"
                    >
                      Grand Total
                    </td>
                    <td className="p-3 border border-gray-400 text-center font-bold">
                      {totalSum.opQtyMain}
                    </td>
                    <td className="p-3 border border-gray-400 text-center font-bold">
                      {totalSum.opQtyAlt.toFixed(3)}
                    </td>
                    <td className="p-3 border border-gray-400 text-center font-bold bg-green-100">
                      {totalSum.qtyInMain}
                    </td>
                    <td className="p-3 border border-gray-400 text-center font-bold">
                      {totalSum.qtyInAlt.toFixed(3)}
                    </td>
                    <td className="p-3 border border-gray-400 text-center font-bold bg-red-100">
                      {totalSum.qtyOutMain}
                    </td>
                    <td className="p-3 border border-gray-400 text-center font-bold">
                      {totalSum.qtyOutAlt.toFixed(3)}
                    </td>
                    <td className="p-3 border border-gray-400 text-center font-bold bg-gray-300">
                      {totalSum.clQtyMain}
                    </td>
                    <td className="p-3 border border-gray-400 text-center font-bold">
                      {totalSum.clQtyAlt.toFixed(3)}
                    </td>
                  </tr>
                  {stockData.length === 0 && (
                    <tr>
                      <td
                        colSpan="12"
                        className="p-4 border border-gray-400 text-center text-gray-500"
                      >
                        No data available. Generate report to view data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
            {/* Sales Report Table - Render only if showSalesReport is true */}
            {showSalesReport && (
              <table className="w-full text-sm min-w-[1200px] border-collapse mt-6">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-300 text-gray-700">
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Date
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Invoice Number
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Item Description
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Quantity
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Unit
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Price
                    </th>
                    <th className="p-3 border border-gray-400 text-center font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((item, index) => (
                    <tr key={item.invoiceNumber} className="bg-white hover:bg-gray-50">
                      <td className="p-3 border border-gray-400 text-center">
                        {item.is_main_item && formatDate(item.date)}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {item.is_main_item && item.invoice_number}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {item.item_description}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {parseFloat(item.quantity).toFixed(3)}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {item.item_description === 'STONES' || item.item_description === 'MOTI' || item.item_description === 'MINNA' || item.item_description === 'COLOR STONE' || item.item_description === 'COLOURING' || item.is_main_item ? 'Gms.' : item.item_description === 'DIAMOND' || item.item_description === 'SOLITAIRE' ? 'Ct.' : ''}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {parseFloat(item.rate).toFixed(2)}
                      </td>
                      <td className="p-3 border border-gray-400 text-center">
                        {parseFloat(item.single_amount).toFixed(3)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-200 sticky bottom-0 z-10">
                    <td className="p-3 border border-gray-400 text-center">
                      Total Items: {totalSales.itemsCount}
                    </td>
                    <td className="p-3 border border-gray-400 text-center" />
                    <td className="p-3 border border-gray-400 text-center" />
                    <td className="p-3 border border-gray-400 text-center">
                      {parseFloat(totalSales.quantity).toFixed(3)}
                    </td>
                    <td className="p-3 border border-gray-400 text-center" />
                    <td className="p-3 border border-gray-400 text-center" />
                    <td className="p-3 border border-gray-400 text-center">
                      {parseFloat(totalSales.amount).toFixed(3)}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={() => {showSalesReport ? handleSalesReportPdf() : handleDownloadPdf()}}
            className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
          >
            Download PDF
          </button>
          <button
            onClick={() => {showSalesReport ? handleSalesReportToExcel() : handleExportToExcel()}}
            className="text-white text-sm hover:shadow-xl shadow-gray-700 font-semibold px-4 py-2 rounded-full border border-white/40 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
          >
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
}
