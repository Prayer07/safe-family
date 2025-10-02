// backend/src/middleware/authMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "No auth" });
    const token = auth.split(" ")[1];
    const payload = jwt.verify((token as string), JWT_SECRET) as { sub: string };
    // payload.sub expected to be user id
    req.user = { id: payload.sub };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// import type { Request, Response, NextFunction } from "express";
// import jwt, { type JwtPayload } from "jsonwebtoken";

// export interface AuthRequest extends Request {
//     user?: { id: string };
// }

// export const authMiddleware = (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction
//     ) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//         const decoded = jwt.verify((token as string), process.env.JWT_SECRET!) as JwtPayload;
//         req.user = { id: decoded.id }; // now you’ll have req.user.id typed
//         next();
//     } catch (err) {
//         return res.status(401).json({ message: "Invalid token" });
//     }
// };



// import type { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";
// import { User } from "../models/User.js";
// import dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

// // Validate JWT_SECRET exists
// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//     throw new Error("⚠️ CRITICAL: JWT_SECRET is not defined in environment variables");
// }

// // Extend Express Request type
// export interface AuthRequest extends Request {
//     user?: {
//         id: string;
//         _id: mongoose.Types.ObjectId;
//         email: string;
//     };
// }

// // JWT Payload interface
// interface JwtPayload {
//     id: string;
//     iat?: number;
//     exp?: number;
// }

// export const authMiddleware = async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         // Check for authorization header
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             res.status(401).json({ 
//                 success: false,
//                 message: "No authorization token provided" 
//             });
//             return;
//         }

//         // Extract token
//         const token = authHeader.split(" ")[1];
        
//         if (!token) {
//             res.status(401).json({ 
//                 success: false,
//                 message: "Invalid token format" 
//             });
//             return;
//         }

//         // Verify token with explicit type handling
//         let decoded: string | jwt.JwtPayload;
        
//         try {
//             decoded = jwt.verify(token, JWT_SECRET);
//         } catch (jwtError) {
//             if (jwtError instanceof jwt.TokenExpiredError) {
//                 res.status(401).json({ 
//                     success: false,
//                     message: "Token has expired" 
//                 });
//                 return;
//             }
            
//             if (jwtError instanceof jwt.JsonWebTokenError) {
//                 res.status(401).json({ 
//                     success: false,
//                     message: "Invalid token" 
//                 });
//                 return;
//             }
            
//             throw jwtError; // Re-throw unexpected errors
//         }

//         // Type guard to ensure decoded is an object
//         if (typeof decoded === "string") {
//             res.status(401).json({ 
//                 success: false,
//                 message: "Invalid token structure" 
//             });
//             return;
//         }

//         // Cast to our JwtPayload interface
//         const payload = decoded as JwtPayload;
        
//         if (!payload.id) {
//             res.status(401).json({ 
//                 success: false,
//                 message: "Invalid token payload" 
//             });
//             return;
//         }

//         // Verify user exists
//         const user = await User.findById(payload.id)
//             .select("_id email")
//             .lean<{ _id: mongoose.Types.ObjectId; email: string }>();
            
//         if (!user) {
//             res.status(401).json({ 
//                 success: false,
//                 message: "User not found or has been deleted" 
//             });
//             return;
//         }

//         // Attach user to request - properly typed
//         req.user = {
//             id: payload.id,
//             _id: user._id,
//             email: user.email,
//         };

//         next();
//     } catch (error) {
//         console.error("Auth middleware error:", error);
//         res.status(500).json({ 
//             success: false,
//             message: "Authentication error" 
//         });
//     }
// };