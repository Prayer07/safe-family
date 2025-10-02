// backend/src/controllers/historyController.ts
import type { Request, Response } from "express";
import { Family } from "../models/Family.js";
import { Location } from "../models/Location.js";
import { SosAlert } from "../models/SosAlert.js";

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const family = await Family.findOne({ members: userId });
    if (!family) return res.status(404).json({ message: "No family" });

    const memberIds = family.members as unknown as string[];

    const locations = await Location.find({ user: { $in: memberIds } })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    const sos = await SosAlert.find({ family: family._id }).sort({ timestamp: -1 }).limit(20).lean();

    const hist = [
      ...locations.map((l) => ({ _id: l._id.toString(), type: "location", user: l.user.toString(), coords: l.coords, timestamp: l.timestamp })),
      ...sos.map((s) => ({ _id: s._id.toString(), type: "sos", triggeredBy: s.triggeredBy.toString(), coords: s.coords, status: s.status, timestamp: s.timestamp })),
    ];

    hist.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json(hist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};