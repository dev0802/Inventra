const adminPool = require('../config/database');
const bcrypt = require('bcryptjs');

exports.signUp = async (name, phoneNumber, userPassword) => {
  const existUser = await adminPool.query('SELECT * FROM admin WHERE phone_number = $1', [phoneNumber]);
  if (existUser.rows.length > 0) {
    return {
      message: "Phone Number already exists"
    };
  }

  const hashedPassword = await bcrypt.hash(userPassword, 10);
  const result = await adminPool.query(
    'INSERT INTO admin (name, phone_number, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [name, phoneNumber, hashedPassword]
  );
  return {
    message: "Signup successfull",
    user: result.rows[0]
  };

};

exports.logIn = async (phoneNumber, userPassword) => {
  const result = await adminPool.query(
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
  return { message: "Login successfull" };
};

exports.resetPassword = async (phoneNumber, newUserPassword) => {
  
  const hashedPassword = await bcrypt.hash(newUserPassword, 10);
  const result = await adminPool.query(
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
