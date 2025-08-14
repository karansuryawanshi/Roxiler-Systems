import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

export const signJWT = (payload, opts = {}) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d", ...opts });

export const verifyJWT = (token) => jwt.verify(token, JWT_SECRET);
