import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "../config";

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (id: string): string => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
};