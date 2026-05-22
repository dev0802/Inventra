const {Pool} = require("../config/database");

exports.setGoldRate = async (goldRateData) => {
  const { goldRate24K, goldRate22K, goldRate18K, goldRate14K, rate_date } = goldRateData;
  const query = `INSERT INTO goldrate (gold_rate_24K, gold_rate_22K, gold_rate_18K, gold_rate_14K, rate_date) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [goldRate24K, goldRate22K, goldRate18K, goldRate14K, rate_date];
  const result = await Pool.query(query, values);
  return result.rows[0];
};

exports.getLatestGoldRate = async () => {
  const query = `SELECT * FROM goldrate ORDER BY rate_date DESC LIMIT 1`;
  const result = await Pool.query(query);
  return result.rows[0];
};

exports.getGoldRateByDate = async (date) => {
  const query = `SELECT * FROM goldrate WHERE rate_date = $1`;
  const result = await Pool.query(query, [date]);
  return result.rows[0];
};