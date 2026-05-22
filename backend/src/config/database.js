const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ═══════════════════════════════════════════════════════
// TABLE CREATION
// ═══════════════════════════════════════════════════════

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
      unit_price       BOOLEAN      DEFAULT true,
      making_charges   NUMERIC(5,2),
      version          INTEGER      NOT NULL DEFAULT 0  -- OCC version column
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

// ─────────────────────────────────────────────
// Migrations: add columns to already-existing tables
// (safe to run repeatedly — all use IF NOT EXISTS / IF NOT EXISTS equivalent)
// ─────────────────────────────────────────────
const runMigrations = async (client) => {
  // Add OCC version column to itemdetail if an older DB doesn't have it yet
  await client.query(`
    ALTER TABLE itemdetail
      ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 0
  `);

  // Add OCC version column to itemdescription if missing
  await client.query(`
    ALTER TABLE itemdescription
      ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 0
  `);

  console.log("Migrations applied");
};

// ─────────────────────────────────────────────
// createAllTables — call this ONCE on app startup
// Runs inside a single transaction: all tables are created or none are.
// ─────────────────────────────────────────────
const createAllTables = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await adminTable(client);
    await createCustomerTable(client);
    await createItemDescriptionTable(client);  // version column already included
    await createItemDetailTable(client);        // version column already included
    await createProductDetailTable(client);
    await goldRateTable(client);
    await printInvoiceTable(client);

    // Migrations handle the case where the DB already existed without version columns
    await runMigrations(client);

    await client.query("COMMIT");
    console.log("All tables ready");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Table creation failed, rolled back:", err);
    throw err;
  } finally {
    client.release();
  }
};

// ═══════════════════════════════════════════════════════
// TRANSACTION HELPERS
// ═══════════════════════════════════════════════════════

/** Standard READ COMMITTED transaction */
const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

/**
 * SERIALIZABLE transaction with automatic retry.
 * Retries on serialization failure (40001) or deadlock (40P01)
 * using exponential back-off.
 */
const withSerializableTransaction = async (callback, maxRetries = 3) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      if ((err.code === "40001" || err.code === "40P01") && attempt < maxRetries - 1) {
        attempt++;
        const backoff = Math.pow(2, attempt) * 50 + Math.random() * 50;
        await new Promise((r) => setTimeout(r, backoff));
        continue;
      }
      throw err;
    } finally {
      client.release();
    }
  }
};

// ═══════════════════════════════════════════════════════
// GOLD RATE OPS — pessimistic lock
// ═══════════════════════════════════════════════════════
const goldRateOps = {
  getForUpdate: async (client) => {
    const { rows } = await client.query(
      `SELECT * FROM goldrate WHERE rate_date = CURRENT_DATE FOR UPDATE`
    );
    return rows[0] || null;
  },

  upsert: async ({ gold_rate_24K, gold_rate_22K, gold_rate_18K, gold_rate_14K }) => {
    return withTransaction(async (client) => {
      // Lock any existing row for today — concurrent writers wait here
      const { rows: existing } = await client.query(
        `SELECT gold_rate_id FROM goldrate
         WHERE rate_date = CURRENT_DATE
         FOR UPDATE`
      );

      if (existing.length) {
        const { rows } = await client.query(
          `UPDATE goldrate SET
             gold_rate_24K = $1,
             gold_rate_22K = $2,
             gold_rate_18K = $3,
             gold_rate_14K = $4
           WHERE gold_rate_id = $5
           RETURNING *`,
          [gold_rate_24K, gold_rate_22K, gold_rate_18K, gold_rate_14K, existing[0].gold_rate_id]
        );
        return rows[0];
      } else {
        const { rows } = await client.query(
          `INSERT INTO goldrate (gold_rate_24K, gold_rate_22K, gold_rate_18K, gold_rate_14K)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [gold_rate_24K, gold_rate_22K, gold_rate_18K, gold_rate_14K]
        );
        return rows[0];
      }
    });
  },
};

// ═══════════════════════════════════════════════════════
// PRODUCT OPS — advisory lock per item_code
// ═══════════════════════════════════════════════════════
const productOps = {
  markAsSold: async (item_code, sale_date = new Date()) => {
    return withTransaction(async (client) => {
      await client.query("SELECT pg_advisory_xact_lock($1)", [item_code]);

      const { rows: check } = await client.query(
        `SELECT is_sold, is_deleted FROM productdetail WHERE item_code = $1`,
        [item_code]
      );

      if (!check.length)       throw new Error(`Product ${item_code} not found`);
      if (check[0].is_deleted) throw new Error(`Product ${item_code} is deleted`);
      if (check[0].is_sold)    throw new Error(`Product ${item_code} already sold`);

      const { rows } = await client.query(
        `UPDATE productdetail
         SET is_sold = true, sale_date = $1
         WHERE item_code = $2
         RETURNING *`,
        [sale_date, item_code]
      );
      return rows[0];
    });
  },

  softDelete: async (item_code) => {
    return withTransaction(async (client) => {
      await client.query("SELECT pg_advisory_xact_lock($1)", [item_code]);

      const { rows } = await client.query(
        `UPDATE productdetail
         SET is_deleted = true
         WHERE item_code = $1 AND is_deleted = false
         RETURNING *`,
        [item_code]
      );
      if (!rows.length) throw new Error(`Product ${item_code} not found or already deleted`);
      return rows[0];
    });
  },
};

// ═══════════════════════════════════════════════════════
// CUSTOMER OPS — pessimistic lock
// ═══════════════════════════════════════════════════════
const customerOps = {
  update: async (customer_id, fields) => {
    return withTransaction(async (client) => {
      const { rows: existing } = await client.query(
        `SELECT * FROM customerdetail WHERE customer_id = $1 FOR UPDATE`,
        [customer_id]
      );
      if (!existing.length) throw new Error(`Customer ${customer_id} not found`);

      const merged = { ...existing[0], ...fields };
      const { rows } = await client.query(
        `UPDATE customerdetail SET
           customer_name    = $1,
           birthday         = $2,
           anniversary      = $3,
           phone_no1        = $4,
           phone_no2        = $5,
           email            = $6,
           address          = $7,
           address_state    = $8,
           address_district = $9,
           address_pincode  = $10,
           customer_gstin   = $11
         WHERE customer_id  = $12
         RETURNING *`,
        [
          merged.customer_name, merged.birthday,    merged.anniversary,
          merged.phone_no1,     merged.phone_no2,   merged.email,
          merged.address,       merged.address_state, merged.address_district,
          merged.address_pincode, merged.customer_gstin, customer_id,
        ]
      );
      return rows[0];
    });
  },
};

// ═══════════════════════════════════════════════════════
// INVOICE OPS — serializable transaction
// ═══════════════════════════════════════════════════════
const invoiceOps = {
  /**
   * @param {object} customer       - full customer snapshot (stored as JSONB)
   * @param {Array}  items          - array of item snapshots (stored as JSONB)
   * @param {number} invoice_number
   * @param {string} financial_year - e.g. "2024-25"
   * @param {number} total_amount
   */
  create: async ({ customer, items = [], invoice_number, financial_year, total_amount }) => {
    return withSerializableTransaction(async (client) => {
      // Explicit duplicate check → clean error message
      const { rows: dup } = await client.query(
        `SELECT invoice_id FROM printinvoice
         WHERE invoice_number = $1 AND financial_year = $2`,
        [invoice_number, financial_year]
      );
      if (dup.length) {
        throw new Error(`Invoice #${invoice_number} for ${financial_year} already exists`);
      }

      const { rows } = await client.query(
        `INSERT INTO printinvoice
           (customer, items, invoice_number, financial_year, total_amount)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          JSON.stringify(customer),
          JSON.stringify(items),
          invoice_number,
          financial_year,
          total_amount,
        ]
      );
      return rows[0];
    });
  },

  getForUpdate: async (client, invoice_id) => {
    const { rows } = await client.query(
      `SELECT * FROM printinvoice WHERE invoice_id = $1 FOR UPDATE`,
      [invoice_id]
    );
    return rows[0] || null;
  },

  /** Safe "next invoice number" fetch — call inside withSerializableTransaction */
  getLastInvoiceNumber: async (client, financial_year) => {
    const { rows } = await client.query(
      `SELECT COALESCE(MAX(invoice_number), 0) AS last_num
       FROM printinvoice
       WHERE financial_year = $1`,
      [financial_year]
    );
    return rows[0].last_num;
  },
};

// ═══════════════════════════════════════════════════════
// ITEM DETAIL OPS — optimistic concurrency (OCC)
// ═══════════════════════════════════════════════════════
const itemDetailOps = {
  update: async (item_id, fields, knownVersion) => {
    const { rowCount, rows } = await pool.query(
      `UPDATE itemdetail SET
         item_description = $1,
         code             = $2,
         group_code       = $3,
         hsn_code         = $4,
         quantity         = $5,
         rate             = $6,
         unit_price       = $7,
         making_charges   = $8,
         version          = version + 1
       WHERE item_id = $9 AND version = $10
       RETURNING *`,
      [
        fields.item_description, fields.code,       fields.group_code,
        fields.hsn_code,         fields.quantity,   fields.rate,
        fields.unit_price,       fields.making_charges,
        item_id, knownVersion,
      ]
    );
    if (rowCount === 0) {
      throw new Error("Conflict: item was modified by another user. Please reload and try again.");
    }
    return rows[0];
  },
};

// ═══════════════════════════════════════════════════════
// ITEM DESCRIPTION OPS — optimistic concurrency (OCC)
// ═══════════════════════════════════════════════════════
const itemDescriptionOps = {
  update: async (item_description_id, item_description, knownVersion) => {
    const { rowCount, rows } = await pool.query(
      `UPDATE itemdescription SET
         item_description = $1,
         version          = version + 1
       WHERE item_description_id = $2 AND version = $3
       RETURNING *`,
      [item_description, item_description_id, knownVersion]
    );
    if (rowCount === 0) {
      throw new Error("Conflict: description was modified by another user. Please reload and try again.");
    }
    return rows[0];
  },
};

// ═══════════════════════════════════════════════════════
// ADMIN OPS — UNIQUE constraint on phone_number is the guard
// ═══════════════════════════════════════════════════════
const adminOps = {
  create: async ({ name, phone_number, password_hash }) => {
    try {
      const { rows } = await pool.query(
        `INSERT INTO admin (name, phone_number, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, phone_number`,
        [name, phone_number, password_hash]
      );
      return rows[0];
    } catch (err) {
      if (err.code === "23505") {
        throw new Error(`Phone number ${phone_number} is already registered`);
      }
      throw err;
    }
  },
};

module.exports = {
  Pool: pool,
  createAllTables,           // call once on startup
  withTransaction,
  withSerializableTransaction,
  goldRateOps,
  productOps,
  customerOps,
  invoiceOps,
  itemDetailOps,
  itemDescriptionOps,
  adminOps,
};