const adminPool = require('../config/db');
const bcrypt = require('bcryptjs');
exports.signup = async(name, phone_number, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await adminPool.query(
      'INSERT INTO admin (name, phone_number, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [name, phone_number, hashedPassword]
    );
    return {
      message: "Signup successful",
      user: result.rows[0]
    };
};

exports.login = async(phone_number, password) => {
    const result = await adminPool.query(
      'SELECT * FROM admin WHERE phone_number = $1',
      [phone_number]
    );
    const user = result.rows[0];
    if (!user) {
      return {message : "User not found"};
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      return {message : "Invalid Password"};
    }
    return {message : "Login successful"};
};

exports.checkPhoneNumber = async(phone_number) => {
    const result = await adminPool.query(
      'SELECT * FROM admin WHERE phone_number = $1',
      [phone_number]
    );
    if(result.rows.length > 0) {
        return {exists : true};
    }
    return {exists : false};

};

exports.checkPassword = async(phone_number, password) => {
    const result = await adminPool.query(
      'SELECT * FROM admin WHERE phone_number = $1',
      [phone_number]
    );
    const user = result.rows[0];
    if (!user) {
        return {message : "User not found"};
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return {message : "Password is incorrect"};
    }
    return {message : "Password is correct"};
};

exports.resetPassword = async(phone_number, new_password) => {
    const hashedPassword = await bcrypt.hash(new_password, 10);
    const result = await adminPool.query(
      'UPDATE admin SET password_hash = $1 WHERE phone_number = $2 RETURNING *',
      [hashedPassword, phone_number]
    );
    return {
      message: "Password reset successful",
      user: result.rows[0]
    };

};
