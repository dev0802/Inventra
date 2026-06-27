const logger = require("../utilis/loggerFile");
const authService = require("../services/authService");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.signUp = async (req, res) => {
  const { name, phoneNumber, userPassword } = req.body;
  logger.info(`User Signing-Up | Name: ${name} | Phone: ${phoneNumber}`);
  try {
    const user = await authService.signUp(name, phoneNumber, userPassword);

    if (user.message === "Phone Number already exists") {
      logger.error(
        `Sign-Up failed | Phone already exists | Phone: ${phoneNumber}`,
      );
      return res.status(409).json(user);
    }

    logger.info(`User successfully signed-up | Phone: ${phoneNumber}`);
    return res.status(201).json(user);
  } catch (error) {
    logger.error(`Sign-Up error | ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.logIn = async (req, res) => {
  const { phoneNumber, userPassword } = req.body;
  logger.info(`User Logging-In attempt | Phone: ${phoneNumber}`);
  try {
    const user = await authService.logIn(phoneNumber, userPassword);

    if (user.message === "User not found") {
      logger.error(`Login failed | User not found | Phone: ${phoneNumber}`);
      return res.status(404).json(user);
    }
    if (user.message === "Invalid Password") {
      logger.error(`Login failed | Invalid Password | Phone: ${phoneNumber}`);
      return res.status(401).json(user);
    }

    res.cookie("token", user.token, cookieOptions);
    logger.info(`User Logged-In successfully | Phone: ${phoneNumber}`);
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Login error | Phone: ${phoneNumber} | ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { phoneNumber, newUserPassword } = req.body;
  logger.info(`Password Reset attempt | Phone: ${phoneNumber}`);
  try {
    const user = await authService.resetPassword(phoneNumber, newUserPassword);

    if (user.message === "User not found") {
      logger.error(
        `Password Reset failed | User not found | Phone: ${phoneNumber}`,
      );
      return res.status(404).json(user);
    }

    logger.info(`Password Reset successful | Phone: ${phoneNumber}`);
    return res.status(200).json(user);
  } catch (error) {
    logger.error(`Password Reset error | Phone: ${phoneNumber} | ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.logOut = (req, res) => {
  logger.info(`User Logged-Out Successfully | User Id: ${req.user.userId} & User: ${req.user.userName}`);
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
};

exports.verifySession = (req, res) => {
  if (req.user) {
    return res
      .status(200)
      .json({ message: "Session is valid", user: req.user });
  } else {
    return res.status(401).json({ message: "No active session" });
  }
};