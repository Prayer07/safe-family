// backend/src/controllers/authController.ts
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, type IUser } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

function generateToken(user: IUser): string {
  return jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: "7d" });
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body as {
      name: string;
      email: string;
      phone?: string;
      password: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: hash,
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// import type { Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import { User } from "../models/User.js";
// import jwt from "jsonwebtoken";
// // import { JWT_SECRET, JWT_EXPIRES_IN } from "../config";
// import dotenv from "dotenv";
// dotenv.config();

// interface AuthRequest extends Request {
//     user?: { id: string };
// }

// const JWT_SECRET = process.env.JWT_SECRET!;
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

// const generateToken = (id: string): string => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

// export const signup = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { name, email, password, phone } = req.body as { name: string; email?: string; password?: string; phone?: string };

//         if (!name) {
//         res.status(400).json({ message: "Name required" });
//         return;
//         }

//         if (email) {
//         const exists = await User.findOne({ email });
//         if (exists) {
//             res.status(400).json({ message: "Email already in use" });
//             return;
//         }
//         }

//         const hashed = password ? await bcrypt.hash(password, 10) : undefined;
//         const user = await User.create({ name, email, password: hashed, phone });

//         res.status(201).json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         token: generateToken((user._id as string).toString()),
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Signup failed", error });
//     }
//     };

// export const login = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { email, password } = req.body as { email?: string; password?: string };

//         if (!email || !password) {
//         res.status(400).json({ message: "Email and password required" });
//         return;
//         }

//         const user = await User.findOne({ email });
//         if (!user || !user.password) {
//         res.status(400).json({ message: "Invalid credentials" });
//         return;
//         }

//         const ok = await bcrypt.compare(password, user.password);
//         if (!ok) {
//         res.status(400).json({ message: "Invalid credentials" });
//         return;
//         }

//         res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         token: generateToken((user._id as string).toString()),
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Login failed", error });
//     }
// };

// export const getMe = async (req: AuthRequest, res: Response) => {
//     try {
//         if (!req.user?.id) {
//         return res.status(401).json({ message: "Not authorized" });
//         }

//         const user = await User.findById(req.user.id).select("-password");
//         if (!user) {
//         return res.status(404).json({ message: "User not found" });
//         }

//         res.json(user);
//     } catch (err) {
//         res.status(500).json({ message: "Server error" });
//     }
// };