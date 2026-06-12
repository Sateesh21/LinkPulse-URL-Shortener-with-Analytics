const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_KEY, { expiresIn: "1d" });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_KEY, { expiresIn: "7d" });
};

module.exports = { generateAccessToken, generateRefreshToken };