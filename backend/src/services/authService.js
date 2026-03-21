const adminPool = require('../config/db');
const bcrypt = require('bcryptjs');
exports.signup = async(name, phone_number, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await adminPool.query(
      'INSERT INTO admin (name, phone_number, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [name, phone_number, hashedPassword]
    );
    return result.rows[0];
};

exports.login = async(phone_number, password) => {
    const result = await adminPool.query(
      'SELECT * FROM admin WHERE phone_number = $1',
      [phone_number]
    );
    const user = result.rows[0];
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    return {message : "Login successful"};
};

exports.resetPassword = async(phone_number, new_password) => {
    const hashedPassword = await bcrypt.hash(new_password, 10);
    const result = await adminPool.query(
      'UPDATE admin SET password_hash = $1 WHERE phone_number = $2 RETURNING *',
      [hashedPassword, phone_number]
    );
    return result.rows[0];

};
