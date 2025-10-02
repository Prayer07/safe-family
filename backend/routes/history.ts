// backend/src/routes/history.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getHistory } from "../controllers/historyController.js";

const router = Router();

router.get("/", authMiddleware, getHistory);

export default router;






// import { Router } from "express";
// import { authMiddleware, type AuthRequest } from "../middleware/authMiddleware.js";
// import { Location } from "../models/Location.js";
// import { SOSEvent } from "../models/SosAlert.js";
// import { Family } from "../models/Family.js";


// const router = Router();

// // GET /api/history
// router.get("/", authMiddleware, async (req: AuthRequest, res) => {
//   try {
//     const userId = req.user?.id;

//     // get user family
//     const family = await Family.findOne({ members: userId });
//     if (!family) {
//       return res.status(404).json({ message: "User not in a family" });
//     }

//     // fetch locations (last 50 entries for family)
//     const locations = await Location.find({ user: { $in: family.members } })
//       .sort({ timestamp: -1 })
//       .limit(50)
//       .lean();

//     // fetch sos alerts (last 20 for family)
//     const sos = await SOSEvent.find({ family: family._id })
//       .sort({ timestamp: -1 })
//       .limit(20)
//       .lean();

//     // unify format
//     const history = [
//       ...locations.map((l) => ({
//         _id: l._id,
//         type: "location" as const,
//         user: l.user,
//         coords: l.coords,
//         timestamp: l.timestamp,
//       })),
//       ...sos.map((s) => ({
//         _id: s._id,
//         type: "sos" as const,
//         triggeredBy: s.triggeredBy,
//         coords: s.coords,
//         status: s.status,
//         timestamp: s.timestamp,
//       })),
//     ];

//     // sort by timestamp desc
//     history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

//     res.json(history);
//   } catch (err: any) {
//     console.error("Error fetching history:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;