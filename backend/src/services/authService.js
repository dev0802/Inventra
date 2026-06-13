// Service for handling user authentication (sign-up, log-in, password reset)
const {Pool} = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Function to handle user sign-up
exports.signUp = async (name, phoneNumber, userPassword) => {
  const existUser = await Pool.query('SELECT * FROM admin WHERE phone_number = $1', [phoneNumber]);
  if (existUser.rows.length > 0) {
    return {
      message: "Phone Number already exists"
    };
  }
  
  const hashedPassword = await bcrypt.hash(userPassword, 10);
  const result = await Pool.query(
    'INSERT INTO admin (name, phone_number, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [name, phoneNumber, hashedPassword]
  );
  return {
    message: "Signup successfull",
    user: result.rows[0],
  };
};
// Function to handle user log-in
exports.logIn = async (phoneNumber, userPassword) => {
  const result = await Pool.query(
    'SELECT * FROM admin WHERE phone_number = $1',
    [phoneNumber]
  );

  const user = result.rows[0];

  if (!user) {
    return { message: "User not found" };
  }
  const isMatch = await bcrypt.compare(userPassword, user.password_hash);

  if (!isMatch) {
    return { message: "Invalid Password" };
  }

  const token = jwt.sign({
    userId: user.id,
    userName: user.name,
  }, 
  process.env.JWT_SECRET, { expiresIn: '7d' }
  );
  return { message: "Login successfull",
    name: user.name,
    token: token
   };
};
// Function to handle password reset
exports.resetPassword = async (phoneNumber, newUserPassword) => {
  
  const hashedPassword = await bcrypt.hash(newUserPassword, 10);
  const result = await Pool.query(
    'UPDATE admin SET password_hash = $1 WHERE phone_number = $2 RETURNING *',
    [hashedPassword, phoneNumber]
  );
  if (result.rowCount === 0) {
    return {
      message: "User not found"
    }
  }
  return {

    message: "Password reset successfull",
    user: result.rows[0]
  };
};
