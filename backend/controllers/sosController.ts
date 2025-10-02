// backend/src/controllers/sosController.ts
import type { Request, Response } from "express";
import { SosAlert } from "../models/SosAlert.js";
import { Family } from "../models/Family.js";
import mongoose from "mongoose";

export const triggerSos = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { coords } = req.body as { coords?: { lat: number; lng: number } };
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const family = await Family.findOne({ members: userId });
    if (!family) return res.status(404).json({ message: "No family" });

    const sos = await SosAlert.create({
      family: family._id,
      triggeredBy: new mongoose.Types.ObjectId(userId),
      coords,
      status: "triggered",
      timestamp: new Date(),
      responders: [],
    });

    // TODO: emit socket.io event and trigger push/SMS via Twilio
    // e.g. io.to(`family:${family._id}`).emit("sos:new", sos);

    res.status(201).json(sos);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const acknowledgeSos = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const sosId = req.params.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const sos = await SosAlert.findById(sosId);
    if (!sos) return res.status(404).json({ message: "Not found" });

    sos.status = "acknowledged";
    sos.responders.push(new mongoose.Types.ObjectId(userId));
    await sos.save();

    // TODO: io.to(`family:${sos.family}`).emit("sos:update", sos);

    res.json(sos);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// import type { Request, Response } from "express";
// import mongoose from "mongoose";
// import { SOSEvent } from "../models/SOSEvent.js";
// import { Family } from "../models/Family.js";
// import { getIO } from "../socket.js";
// import { sendSMS, initiateCall, sendPushNotification } from "../utils/notificationService.js";

// const SOS_THROTTLE_SECONDS = 120; // throttle per user

// interface PopulatedMember {
//     _id: mongoose.Types.ObjectId;
//     phone?: string;
//     avatarUrl?: string;
//     name: string;
//     email: string;
//     pushToken?: string;
// }

// interface PopulatedOwner {
//     _id: mongoose.Types.ObjectId;
//     phone?: string;
//     name: string;
// }

// export const triggerSOS = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const userId = (req as any).user?.id as string;
//         const userName = (req as any).user?.name || "A family member";
//         const { deviceId, lat, lng } = req.body as { deviceId?: string; lat: number; lng: number };
        
//         if (!lat || !lng) {
//             res.status(400).json({ message: "coords required" });
//             return;
//         }

//         // Throttle: check last SOS from this user
//         const last = await SOSEvent.findOne({ 
//             userId: new mongoose.Types.ObjectId(userId) 
//         })
//         .sort({ createdAt: -1 })
//         .limit(1);

//         if (last && (Date.now() - (last.createdAt?.getTime() ?? 0)) / 1000 < SOS_THROTTLE_SECONDS) {
//             res.status(429).json({ 
//                 message: "SOS throttled. Try again later.",
//                 retryAfter: SOS_THROTTLE_SECONDS 
//             });
//             return;
//         }

//         // Find families user is in
//         const families = await Family.find({ 
//             members: new mongoose.Types.ObjectId(userId) 
//         });

//         if (!families || families.length === 0) {
//             res.status(400).json({ message: "User not in any family" });
//             return;
//         }

//         const createdEvents = [];
//         const io = getIO();

//         for (const family of families) {
//             // Create SOS event
//             const ev = await SOSEvent.create({
//                 userId: new mongoose.Types.ObjectId(userId),
//                 familyId: family._id,
//                 deviceId: deviceId ? new mongoose.Types.ObjectId(deviceId) : undefined,
//                 coords: { lat, lng },
//                 status: "triggered",
//             });

//             // Emit WebSocket to family room
//             io.to(`family:${(family._id as string).toString()}`).emit("family:sos", {
//                 id: ev._id,
//                 userId,
//                 userName,
//                 coords: ev.coords,
//                 timestamp: ev.timestamp,
//                 status: ev.status,
//             });

//             // ✅ FIX 1: Get family members - single await, proper typing
//             const familyWithMembers = await Family.findById(family._id)
//                 .populate<{ members: PopulatedMember[] }>("members", "phone avatarUrl name email pushToken")
//                 .lean();

//             const members = familyWithMembers?.members || [];

//             // Send notifications to family members
//             const notificationPromises = [];

//             for (const member of members) {
//                 // Skip the user who triggered SOS
//                 if (member._id.toString() === userId) continue;

//                 // Send SMS if enabled and member has phone
//                 if (member.phone && family.settings?.broadcastSMS) {
//                     const smsPromise = sendSMS(
//                         member.phone,
//                         `🚨 SOS ALERT: ${userName} needs help!\n\nLocation: https://maps.google.com?q=${lat},${lng}\n\nOpen SafeFamily app now!`
//                     ).catch(err => {
//                         console.error(`Failed to send SMS to ${member.phone}:`, err);
//                     });
//                     notificationPromises.push(smsPromise);
//                 }

//                 // Send push notification if member has push token
//                 if (member.pushToken) {
//                     const pushPromise = sendPushNotification(
//                         member.pushToken,
//                         "🚨 SOS Alert",
//                         `${userName} triggered an emergency alert!`,
//                         {
//                             sosId: (ev._id as string).toString(),
//                             userId,
//                             lat: lat.toString(),
//                             lng: lng.toString(),
//                             type: "sos_alert",
//                         }
//                     ).catch(err => {
//                         console.error(`Failed to send push notification to ${member.email}:`, err);
//                     });
//                     notificationPromises.push(pushPromise);
//                 }
//             }

//             // ✅ FIX 2: Auto-call owner if enabled - single await, correct property name
//             if (family.settings?.autoCallOnSOS) {
//                 const familyWithOwner = await Family.findById(family._id)
//                     .populate<{ createdBy: PopulatedOwner }>("createdBy", "phone name")
//                     .lean();

//                 const owner = familyWithOwner?.createdBy;

//                 if (owner?.phone) {
//                     const twiml = `<Response><Say>Emergency alert from SafeFamily. ${userName} has triggered an SOS alert. Please check your dashboard immediately.</Say></Response>`;
                    
//                     const callPromise = initiateCall(owner.phone, twiml).catch(err => {
//                         console.error(`Failed to call owner ${owner.phone}:`, err);
//                     });
                    
//                     notificationPromises.push(callPromise);
//                 }
//             }

//             // Wait for all notifications to complete (fire-and-forget with error handling)
//             await Promise.allSettled(notificationPromises);

//             createdEvents.push(ev);
//         }

//         res.status(201).json({
//             success: true,
//             message: "SOS alert sent successfully",
//             events: createdEvents.map(ev => ({
//                 id: ev._id,
//                 familyId: ev.familyId,
//                 coords: ev.coords,
//                 timestamp: ev.timestamp,
//                 status: ev.status,
//             })),
//         });
//     } catch (error) {
//         console.error("Trigger SOS failed:", error);
//         res.status(500).json({ 
//             success: false,
//             message: "Failed to trigger SOS alert", 
//             error: error instanceof Error ? error.message : "Unknown error" 
//         });
//     }
// };

// export const acknowledgeSOS = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const sosId = req.params.id;
//         const userId = (req as any).user?.id as string;
//         const userName = (req as any).user?.name || "A family member";

//         if (!mongoose.Types.ObjectId.isValid(sosId as string)) {
//             res.status(400).json({ 
//                 success: false,
//                 message: "Invalid SOS ID" 
//             });
//             return;
//         }

//         const ev = await SOSEvent.findById(sosId);
        
//         if (!ev) {
//             res.status(404).json({ 
//                 success: false,
//                 message: "SOS event not found" 
//             });
//             return;
//         }

//         if (ev.status === "acknowledged") {
//             res.status(400).json({ 
//                 success: false,
//                 message: "SOS already acknowledged",
//                 acknowledgedBy: ev.responders.length 
//             });
//             return;
//         }

//         // Update event status
//         ev.status = "acknowledged";
        
//         // Add responder if not already in list
//         const userObjectId = new mongoose.Types.ObjectId(userId);
//         if (!ev.responders.some(r => r.toString() === userId)) {
//             ev.responders.push(userObjectId);
//         }
        
//         await ev.save();

//         // Emit WebSocket update to family
//         const io = getIO();
//         io.to(`family:${ev.familyId.toString()}`).emit("family:sos_update", {
//             id: ev._id,
//             status: ev.status,
//             responders: ev.responders,
//             acknowledgedBy: userName,
//             acknowledgedAt: new Date(),
//         });

//         res.json({
//             success: true,
//             message: "SOS acknowledged successfully",
//             event: {
//                 id: ev._id,
//                 status: ev.status,
//                 responderCount: ev.responders.length,
//             },
//         });
//     } catch (error) {
//         console.error("Acknowledge SOS failed:", error);
//         res.status(500).json({ 
//             success: false,
//             message: "Failed to acknowledge SOS", 
//             error: error instanceof Error ? error.message : "Unknown error" 
//         });
//     }
// };

// export const recentSOS = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const familyId = req.params.familyId;
//         const userId = (req as any).user?.id as string;

//         if (!mongoose.Types.ObjectId.isValid(familyId as string)) {
//             res.status(400).json({ 
//                 success: false,
//                 message: "Invalid family ID" 
//             });
//             return;
//         }

//         // Verify user is in this family
//         const family = await Family.findById(familyId);
//         if (!family) {
//             res.status(404).json({ 
//                 success: false,
//                 message: "Family not found" 
//             });
//             return;
//         }

//         const isMember = family.members.some(
//             memberId => memberId.toString() === userId
//         );

//         if (!isMember) {
//             res.status(403).json({ 
//                 success: false,
//                 message: "Access denied to this family" 
//             });
//             return;
//         }

//         // Get recent SOS events
//         const events = await SOSEvent.find({ 
//             familyId: new mongoose.Types.ObjectId(familyId) 
//         })
//         .populate("userId", "name email avatarUrl")
//         .sort({ timestamp: -1 })
//         .limit(20)
//         .lean();

//         res.json({
//             success: true,
//             events: events.map(ev => ({
//                 id: ev._id,
//                 userId: ev.userId,
//                 coords: ev.coords,
//                 timestamp: ev.timestamp,
//                 status: ev.status,
//                 responderCount: ev.responders?.length || 0,
//             })),
//             total: events.length,
//         });
//     } catch (error) {
//         console.error("Fetch recent SOS failed:", error);
//         res.status(500).json({ 
//             success: false,
//             message: "Failed to fetch recent SOS events", 
//             error: error instanceof Error ? error.message : "Unknown error" 
//         });
//     }
// };