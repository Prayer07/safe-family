// backend/src/controllers/familyController.ts
import type { Request, Response } from "express";
import crypto from "crypto";
import { Family } from "../models/Family.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";

export const createFamily = async (req: Request, res: Response) => {
  try {
    const { name } = req.body as { name?: string };
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!name) return res.status(400).json({ message: "Name required" });

    const inviteCode = crypto.randomBytes(4).toString("hex");

    const family = await Family.create({
      name,
      owner: new mongoose.Types.ObjectId(userId),
      members: [new mongoose.Types.ObjectId(userId)],
      inviteCode,
    });

    await User.findByIdAndUpdate(userId, { family: family._id });

    res.status(201).json(family);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const joinFamily = async (req: Request, res: Response) => {
  try {
    const { inviteCode } = req.body as { inviteCode?: string };
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!inviteCode) return res.status(400).json({ message: "Invite code required" });

    const family = await Family.findOne({ inviteCode });
    if (!family) return res.status(404).json({ message: "Invalid invite code" });

    if (family.members.find((m) => m.toString() === userId)) {
      return res.status(400).json({ message: "Already a member" });
    }

    family.members.push(new mongoose.Types.ObjectId(userId));
    await family.save();

    await User.findByIdAndUpdate(userId, { family: family._id });

    res.json(family);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyFamily = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const family = await Family.findOne({ members: userId }).populate("members", "name email phone avatarUrl lastActiveAt").lean();
    if (!family) return res.status(404).json({ message: "No family" });

    res.json(family);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};




// import type { Request, Response } from "express";
// import crypto from "crypto";
// import mongoose from "mongoose";
// import { Family } from "../models/Family.js";
// import { User } from "../models/User.js";

// export const createFamily = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const userId = (req as any).user?.id as string;
//         const { name } = req.body as { name?: string };
//         if (!name) {
//         res.status(400).json({ message: "Family name required" });
//         return;
//         }
//         const inviteCode = crypto.randomBytes(3).toString("hex").toUpperCase();
//         const family = await Family.create({ name, ownerUserId: new mongoose.Types.ObjectId(userId), members: [new mongoose.Types.ObjectId(userId)], inviteCode });
//         res.status(201).json(family);
//     } catch (error) {
//         res.status(500).json({ message: "Create family failed", error });
//     }
// };

// export const createInvite = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const familyId = req.params.id;
//         const userId = (req as any).user?.id as string;
//         const family = await Family.findById(familyId);
//         if (!family) {
//         res.status(404).json({ message: "Family not found" });
//         return;
//         }
//         if (family.ownerUserId.toString() !== userId) {
//         res.status(403).json({ message: "Not allowed" });
//         return;
//         }
//         const inviteCode = crypto.randomBytes(3).toString("hex").toUpperCase();
//         family.inviteCode = inviteCode;
//         await family.save();
//         res.json({ inviteCode });
//     } catch (error) {
//         res.status(500).json({ message: "Create invite failed", error });
//     }
// };

// export const joinFamily = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { code } = req.body as { code?: string };
//         const userId = (req as any).user?.id as string;
//         if (!code) {
//         res.status(400).json({ message: "Invite code required" });
//         return;
//         }
//         const family = await Family.findOne({ inviteCode: code });
//         if (!family) {
//         res.status(404).json({ message: "Invite not found" });
//         return;
//         }
//         const uid = new mongoose.Types.ObjectId(userId);
//         if (!family.members.some((m) => m.equals(uid))) {
//         family.members.push(uid);
//         await family.save();
//         }
//         res.json({ familyId: family._id, name: family.name });
//     } catch (error) {
//         res.status(500).json({ message: "Join family failed", error });
//     }
// };

// export const listMembers = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const familyId = req.params.id;
//         const userId = (req as any).user?.id as string;
//         const family = await Family.findById(familyId).populate("members", "name email avatarUrl lastActiveAt");
//         if (!family) {
//         res.status(404).json({ message: "Family not found" });
//         return;
//         }
//         // check user is member
//         if (!family.members.some((m: any) => (m._id ? m._id.toString() === userId : m.toString() === userId))) {
//         res.status(403).json({ message: "Not a member" });
//         return;
//         }
//         res.json({ members: family.members });
//     } catch (error) {
//         res.status(500).json({ message: "List members failed", error });
//     }
// };

// export const getMyFamily = async (req: Request, res: Response) => {
//     try {
//         const userId =( req as any).user?.id;

//         const family = await Family.findOne({ members: userId })
//         .populate("members", "name email phone avatarUrl lastActiveAt")
//         .lean();

//         if (!family) {
//         return res.status(404).json({ message: "User is not part of a family" });
//         }

//         res.json(family);
//     } catch (err: any) {
//         res.status(500).json({ message: err.message });
//     }
// };