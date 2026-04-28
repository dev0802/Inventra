const express = require('express');
const cors = require('cors');
const app = express();

const authRoute = require('./routes/authRoute');
const addProductRoute = require('./routes/addProductRoute');
const viewProductRoute = require('./routes/viewProductRoute');
const printInvoiceRoute = require('./routes/printInvoiceRoute');

require('dotenv').config();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/auth/', authRoute);
app.use('/api/product/', addProductRoute);
app.use('/api/view-product/', viewProductRoute);
app.use('/api/print-invoice/', require('./routes/printInvoiceRoute'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});