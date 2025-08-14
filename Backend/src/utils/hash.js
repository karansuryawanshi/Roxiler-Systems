import bcrypt from "bcrypt";
const ROUNDS = 10;
export const hash = (plain) => bcrypt.hash(plain, ROUNDS);
export const compareHash = (plain, hashed) => bcrypt.compare(plain, hashed);
