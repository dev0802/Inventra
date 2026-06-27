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

const withAdvisoryLock = async (lockKey, callback) => {
  return withTransaction(async (client) => {
    await client.query(`SELECT pg_advisory_xact_lock(hashtext($1))`, [lockKey]);
    return callback(client);
  });
};

const atomicStateUpdate = async (
  table,
  idColumn,
  idValue,
  setValues,
  whereCondition,
) => {
  const setKeys = Object.keys(setValues);
  const setClause = setKeys.map((k, i) => `${k} = $${i + 2}`).join(", ");
  const values = [idValue, ...setKeys.map((k) => setValues[k])];

  const query = `
    UPDATE ${table}
    SET ${setClause}
    WHERE ${idColumn} = $1 AND ${whereCondition}
    RETURNING *`;

  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    const err = new Error(
      `Conflict: ${table} row (${idColumn}=${idValue}) condition '${whereCondition}' failed — already changed by another request.`,
    );
    err.code = "CONCURRENCY_CONFLICT";
    throw err;
  }
  return result.rows[0];
};

const updateWithVersion = async (
  table,
  idColumn,
  idValue,
  changes,
  expectedVersion,
) => {
  const keys = Object.keys(changes);
  const setClause = keys.map((k, i) => `${k} = $${i + 3}`).join(", ");
  const values = [idValue, expectedVersion, ...keys.map((k) => changes[k])];

  const query = `
    UPDATE ${table}
    SET ${setClause}, version = version + 1
    WHERE ${idColumn} = $1 AND version = $2
    RETURNING *`;

  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    const err = new Error(
      `Conflict: ${table} row (${idColumn}=${idValue}) was modified by someone else. Refresh and retry.`,
    );
    err.code = "CONCURRENCY_CONFLICT";
    throw err;
  }
  return result.rows[0];
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
      address           TEXT,
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
      version              INTEGER NOT NULL DEFAULT 0   -- OCC version column
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
      is_deleted       BOOLEAN        NOT NULL DEFAULT false,
      version          INTEGER        NOT NULL DEFAULT 0   -- OCC version column (naya)
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
      rate_date     DATE          NOT NULL DEFAULT CURRENT_DATE,
      UNIQUE (rate_date)                                    -- naya: ek din ek hi rate row
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
    general_invoice_number INTEGER NOT NULL UNIQUE,
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

const migrateExistingTables = async () => {
  await withTransaction(async (client) => {
    await client.query(`
      ALTER TABLE productdetail
      ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 0
    `);

    await client.query(`
      DO $$
      BEGIN
        ALTER TABLE goldrate ADD CONSTRAINT goldrate_rate_date_unique UNIQUE (rate_date);
      EXCEPTION
        WHEN duplicate_object THEN NULL; -- already exists, skip
      END $$;
    `);

    await client.query(`
      DO $$
      BEGIN
        ALTER TABLE generalinvoice ADD CONSTRAINT generalinvoice_number_unique UNIQUE (general_invoice_number);
      EXCEPTION
        WHEN duplicate_object THEN NULL; -- already exists, skip
      END $$;
    `);

    console.log("Migration complete — concurrency columns/constraints added.");
  });
};

module.exports = {
  Pool: pool,
  createAllTables,
  withTransaction,
  migrateExistingTables,
  withAdvisoryLock,
  atomicStateUpdate,
  updateWithVersion,
};
// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// const withTransaction = async (callback) => {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     const result = await callback(client);
//     await client.query("COMMIT");
//     return result;
//   } catch (error) {
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// };
// const adminTable = async (client) => {
//   await client.query(`
//     CREATE TABLE IF NOT EXISTS admin (
//       id            SERIAL PRIMARY KEY,
//       name          VARCHAR(100) NOT NULL,
//       phone_number  VARCHAR(15)  NOT NULL UNIQUE,
//       password_hash TEXT         NOT NULL
//     )
//   `);
//   console.log("admin table ready");
// };

// const createCustomerTable = async (client) => {
//   await client.query(`
//     CREATE TABLE IF NOT EXISTS customerdetail (
//       customer_id      SERIAL PRIMARY KEY,
//       customer_name    VARCHAR(50)  NOT NULL,
//       details_date     DATE         DEFAULT CURRENT_DATE,
//       birthday         DATE,
//       anniversary      DATE,
//       phone_no1        VARCHAR(20)  NOT NULL UNIQUE,
//       phone_no2        VARCHAR(20)  UNIQUE,
//       email            TEXT,
//       address          TEXT,
//       address_state    VARCHAR(20)  NOT NULL,
//       address_district VARCHAR(20)  NOT NULL,
//       address_pincode  VARCHAR(20)  NOT NULL,
//       gstin            VARCHAR(20)  DEFAULT '03ASRPS4951M1ZO',
//       customer_gstin   VARCHAR(25)
//     )
//   `);
//   console.log("customerdetail table ready");
// };

// const createItemDescriptionTable = async (client) => {
//   await client.query(`
//     CREATE TABLE IF NOT EXISTS itemdescription (
//       item_description_id SERIAL PRIMARY KEY,
//       item_description    TEXT    NOT NULL,
//       version             INTEGER NOT NULL DEFAULT 0   -- OCC version column
//     )
//   `);
//   console.log("itemdescription table ready");
// };

// const createItemDetailTable = async (client) => {
//   await client.query(`
//     CREATE TABLE IF NOT EXISTS itemdetail (
//       item_id          SERIAL PRIMARY KEY,
//       item_description VARCHAR(255),
//       code             TEXT,
//       group_code       INTEGER,
//       hsn_code         VARCHAR(20),
//       quantity         NUMERIC(10,3),
//       rate             NUMERIC(10,2),
//       unit             TEXT DEFAULT 'Gms.',
//       unit_price       BOOLEAN DEFAULT true,
//       making_charges   NUMERIC(5,2),
//       version          INTEGER NOT NULL DEFAULT 0  -- OCC version column
//     )
//   `);
//   console.log("itemdetail table ready");
// };

// const createProductDetailTable = async (client) => {
//   await client.query(`
//     CREATE TABLE IF NOT EXISTS productdetail (
//       product_id       SERIAL PRIMARY KEY,
//       item_description TEXT           NOT NULL,
//       item_code        INTEGER        NOT NULL UNIQUE,
//       gross_weight     NUMERIC(10,3)  NOT NULL,
//       stone_weight     NUMERIC(10,3)  DEFAULT 0,
//       moti_weight      NUMERIC(10,3)  DEFAULT 0,
//       diamond_weight   NUMERIC(10,3)  DEFAULT 0,
//       solitaire_weight NUMERIC(10,3)  DEFAULT 0,
//       color_stone      NUMERIC(10,3)  DEFAULT 0,
//       minna_weight     NUMERIC(10,3)  DEFAULT 0,
//       colouring        NUMERIC(10,3)  DEFAULT 0,
//       net_weight       NUMERIC(10,3)  NOT NULL,
//       purchased_date   DATE           NOT NULL DEFAULT CURRENT_DATE,
//       sale_date        DATE,
//       hsn_code         TEXT           DEFAULT '7113',
//       is_sold          BOOLEAN        NOT NULL DEFAULT false,
//       is_deleted       BOOLEAN        NOT NULL DEFAULT false
//     )
//   `);
//   console.log("productdetail table ready");
// };

// const goldRateTable = async (client) => {
//   await client.query(`
//     CREATE TABLE IF NOT EXISTS goldrate (
//       gold_rate_id  SERIAL PRIMARY KEY,
//       gold_rate_24K NUMERIC(10,2) NOT NULL,
//       gold_rate_22K NUMERIC(10,2) NOT NULL,
//       gold_rate_18K NUMERIC(10,2) NOT NULL,
//       gold_rate_14K NUMERIC(10,2) NOT NULL,
//       rate_date     DATE          NOT NULL DEFAULT CURRENT_DATE
//     )
//   `);
//   console.log("goldrate table ready");
// };

// const printInvoiceTable = async (client) => {
//   await client.query(`
//     CREATE TABLE IF NOT EXISTS printinvoice (
//       invoice_id     SERIAL PRIMARY KEY,
//       customer       JSONB          NOT NULL,
//       items          JSONB          NOT NULL DEFAULT '[]'::JSONB,
//       invoice_number INTEGER        NOT NULL,
//       invoice_date   DATE           NOT NULL DEFAULT CURRENT_DATE,
//       financial_year VARCHAR(10)    NOT NULL,
//       total_amount   NUMERIC(10,2)  NOT NULL,
//       UNIQUE (invoice_number, financial_year)
//     )
//   `);
//   console.log("printinvoice table ready");
// };

// const generalInvoiceTable = async (client) => {
//   await client.query(`
//     CREATE TABLE IF NOT EXISTS generalinvoice (
//     general_invoice_id SERIAL PRIMARY KEY,
//     general_invoice_number INTEGER NOT NULL,
//     items TEXT NOT NULL,
//     invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
//     total_amount NUMERIC(10,2) NOT NULL
//     )
//   `);
//   console.log("generalinvoice table ready");
// };
// const createAllTables = async () => {
//   try {
//     await adminTable(pool);
//     await createCustomerTable(pool);
//     await createItemDescriptionTable(pool);
//     await createItemDetailTable(pool);
//     await createProductDetailTable(pool);
//     await goldRateTable(pool);
//     await printInvoiceTable(pool);
//     await generalInvoiceTable(pool);
//     console.log("All tables created successfully!");
//   } catch (error) {
//     console.error("Error creating tables:", error);
//     throw error;
//   }
// };

// module.exports = {
//   Pool: pool,
//   createAllTables,
//   withTransaction,
// };
