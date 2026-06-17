// Controller for handling user authentication (sign-up, log-in, password reset)
const authService = require('../services/authService');
// Sign-up controller
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

exports.signUp = async (req, res) => {
    const { name, phoneNumber, userPassword } = req.body;
    try {
        const user = await authService.signUp(name, phoneNumber, userPassword);

        if (user.message === "Phone Number already exists") {
            return res.status(409).json(user);// conflict
        }
        return res.status(201).json(user); // user created
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Log-in controller
exports.logIn = async (req, res) => {
    const { phoneNumber, userPassword } = req.body;
    try {
        const user = await authService.logIn(phoneNumber, userPassword);
        if (user.message === "User not found") {
            return res.status(404).json(user);
        }
        if (user.message === "Invalid Password") {
            return res.status(401).json(user);
        }
        res.cookie('token', user.token, cookieOptions);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Password reset controller
exports.resetPassword = async (req, res) => {
    const { phoneNumber, newUserPassword } = req.body;

    try {
        const user = await authService.resetPassword(phoneNumber, newUserPassword);

        if (user.message === "User not found") {
            return res.status(404).json(user);
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.logOut = (req, res) => {
    res.clearCookie('token', cookieOptions);
    res.status(200).json({ message: "Logged out successfully" });
};

exports.verifySession = (req, res) => {
    if (req.user) {
        return res.status(200).json({ message: "Session is valid", user: req.user });
    } else {
        return res.status(401).json({ message: "No active session" });
    } 
};