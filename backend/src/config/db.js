const {Pool} = require('pg');
const adminPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'inventra_db',
  password: '0802',
  port: 5432,
});
module.exports = adminPool;
