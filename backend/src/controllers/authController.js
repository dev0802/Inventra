const authService = require('../services/authService');

exports.signup = async (req, res) => {
    const {name, phone_number, password } = req.body;
    try {
        const user = await authService.signup(name, phone_number, password);
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    const { phone_number, password } = req.body;
    try {
        const user = await authService.login(phone_number, password);
        res.status(200).json(user);
    } catch (error) {        
        console.error(error);
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

exports.checkPhoneNumber = async (req, res) => {
    const { phone_number } = req.body;
    try {
        const result = await authService.checkPhoneNumber(phone_number);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'User not found' });
    }
};

exports.checkPassword = async (req, res) => {
    const { phone_number, password } = req.body;
    try {
        const result = await authService.checkPassword(phone_number, password);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Password is incorrect' });
    }
};


exports.resetPassword = async (req, res) => {
    const { phone_number, new_password } = req.body;
    try {
        const user = await authService.resetPassword(phone_number, new_password);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};