const express = require('express');
const cors = require('cors');
const app = express();
const authRoute = require('./routes/authRoute');
const adminPool = require('./config/database');

app.use(express.json());
app.use(cors());

app.use('/api/auth/', authRoute);
app.get("/", async(req,res)=>{
  const data = await adminPool.query("SELECT * FROM admin");
  res.json(data.rows);
})
app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on port 5000');
});