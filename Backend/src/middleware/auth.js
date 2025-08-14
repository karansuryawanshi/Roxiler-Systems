import { verifyJWT } from "../utils/jwt.js";

export const auth = (req, res, next) => {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer "))
    return res.status(401).json({ message: "Missing token" });
  const token = hdr.split(" ")[1];
  try {
    const decoded = verifyJWT(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
