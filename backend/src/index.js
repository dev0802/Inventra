const express = require('express');
const cors = require('cors');
const app = express();
const authRoute = require('./routes/authRoute');
const adminPool = require('./config/db');

app.use(express.json());
app.use(cors());

app.use('/api/auth/', authRoute);

app.get('/', async(req, res) => {
  const user = await adminPool.query('SELECT * FROM admin');
  res.json(user.rows);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

