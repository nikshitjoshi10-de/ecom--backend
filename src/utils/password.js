const bcrypt = require("bcryptjs");
require('dotenv').config();

const SALT_ROUNDS = Number(process.env.SALT) || 10;

const hashPassword = async(plain) => await bcrypt.hash(plain, SALT_ROUNDS);
const verifyPassword = async(plain, hash) =>await bcrypt.compare(plain, hash);

module.exports = { hashPassword, verifyPassword }