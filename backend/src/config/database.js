const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
const adminTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS admin (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(100) NOT NULL,
      phone_number  VARCHAR(15)  NOT NULL UNIQUE,
      password_hash TEXT         NOT NULL
    )
  `);
  console.log("admin table ready");
};

const createCustomerTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS customerdetail (
      customer_id      SERIAL PRIMARY KEY,
      customer_name    VARCHAR(50)  NOT NULL,
      details_date     DATE         DEFAULT CURRENT_DATE,
      birthday         DATE,
      anniversary      DATE,
      phone_no1        VARCHAR(20)  NOT NULL UNIQUE,
      phone_no2        VARCHAR(20)  UNIQUE,
      email            TEXT,
      address          TEXT,
      address_state    VARCHAR(20)  NOT NULL,
      address_district VARCHAR(20)  NOT NULL,
      address_pincode  VARCHAR(20)  NOT NULL,
      gstin            VARCHAR(20)  DEFAULT '03ASRPS4951M1ZO',
      customer_gstin   VARCHAR(25)
    )
  `);
  console.log("customerdetail table ready");
};

const createItemDescriptionTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS itemdescription (
      item_description_id SERIAL PRIMARY KEY,
      item_description    TEXT    NOT NULL,
      version             INTEGER NOT NULL DEFAULT 0   -- OCC version column
    )
  `);
  console.log("itemdescription table ready");
};

const createItemDetailTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS itemdetail (
      item_id          SERIAL PRIMARY KEY,
      item_description VARCHAR(255),
      code             TEXT,
      group_code       INTEGER,
      hsn_code         VARCHAR(20),
      quantity         NUMERIC(10,3),
      rate             NUMERIC(10,2),
      unit             TEXT DEFAULT 'Gms.',
      unit_price       BOOLEAN DEFAULT true,
      making_charges   NUMERIC(5,2),
      version          INTEGER NOT NULL DEFAULT 0  -- OCC version column
    )
  `);
  console.log("itemdetail table ready");
};

const createProductDetailTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS productdetail (
      product_id       SERIAL PRIMARY KEY,
      item_description TEXT           NOT NULL,
      item_code        INTEGER        NOT NULL UNIQUE,
      gross_weight     NUMERIC(10,3)  NOT NULL,
      stone_weight     NUMERIC(10,3)  DEFAULT 0,
      moti_weight      NUMERIC(10,3)  DEFAULT 0,
      diamond_weight   NUMERIC(10,3)  DEFAULT 0,
      solitaire_weight NUMERIC(10,3)  DEFAULT 0,
      color_stone      NUMERIC(10,3)  DEFAULT 0,
      minna_weight     NUMERIC(10,3)  DEFAULT 0,
      colouring        NUMERIC(10,3)  DEFAULT 0,
      net_weight       NUMERIC(10,3)  NOT NULL,
      purchased_date   DATE           NOT NULL DEFAULT CURRENT_DATE,
      sale_date        DATE,
      hsn_code         TEXT           DEFAULT '7113',
      is_sold          BOOLEAN        NOT NULL DEFAULT false,
      is_deleted       BOOLEAN        NOT NULL DEFAULT false
    )
  `);
  console.log("productdetail table ready");
};

const goldRateTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS goldrate (
      gold_rate_id  SERIAL PRIMARY KEY,
      gold_rate_24K NUMERIC(10,2) NOT NULL,
      gold_rate_22K NUMERIC(10,2) NOT NULL,
      gold_rate_18K NUMERIC(10,2) NOT NULL,
      gold_rate_14K NUMERIC(10,2) NOT NULL,
      rate_date     DATE          NOT NULL DEFAULT CURRENT_DATE
    )
  `);
  console.log("goldrate table ready");
};

const printInvoiceTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS printinvoice (
      invoice_id     SERIAL PRIMARY KEY,
      customer       JSONB          NOT NULL,
      items          JSONB          NOT NULL DEFAULT '[]'::JSONB,
      invoice_number INTEGER        NOT NULL,
      invoice_date   DATE           NOT NULL DEFAULT CURRENT_DATE,
      financial_year VARCHAR(10)    NOT NULL,
      total_amount   NUMERIC(10,2)  NOT NULL,
      UNIQUE (invoice_number, financial_year)
    )
  `);
  console.log("printinvoice table ready");
};

const generalInvoiceTable = async (client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS generalinvoice (
    general_invoice_id SERIAL PRIMARY KEY,
    general_invoice_number INTEGER NOT NULL,
    items TEXT NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_amount NUMERIC(10,2) NOT NULL
    )
  `);
  console.log("generalinvoice table ready");
};
const createAllTables = async () => {
  try {
    await adminTable(pool);
    await createCustomerTable(pool);
    await createItemDescriptionTable(pool);
    await createItemDetailTable(pool);
    await createProductDetailTable(pool);
    await goldRateTable(pool);
    await printInvoiceTable(pool);
    await generalInvoiceTable(pool);
    console.log("All tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};

module.exports = {
  Pool: pool,
  createAllTables,
  withTransaction,
};
