const express = require("express");
const cors = require("cors");
const app = express();
const cookies = require("cookie-parser");

const authRoute = require("./routes/authRoute");
const addProductRoute = require("./routes/addProductRoute");
const viewProductRoute = require("./routes/viewProductRoute");
const printInvoiceRoute = require("./routes/printInvoiceRoute");
const reportRoute = require("./routes/reportRoute");
const goldRateRoute = require("./routes/goldRateRoute");
const { createAllTables } = require("./config/database");

require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookies());

app.use("/api/auth/", authRoute);
app.use("/api/product/", addProductRoute);
app.use("/api/view-product/", viewProductRoute);
app.use("/api/print-invoice/", require("./routes/printInvoiceRoute"));
app.use("/api/report/", require("./routes/reportRoute"));
app.use("/api/gold-rate/", require("./routes/goldRateRoute"));

const startServer = async () => {
  await createAllTables();

  app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log("Server running on all interfaces");
  });
};

startServer();
