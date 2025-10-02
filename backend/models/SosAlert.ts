// backend/src/models/SosAlert.ts
import mongoose, { Document, Schema } from "mongoose";

export type SosStatus = "triggered" | "acknowledged" | "resolved";

export interface ISosAlert extends Document {
  family: mongoose.Types.ObjectId;
  triggeredBy: mongoose.Types.ObjectId;
  coords?: { lat: number; lng: number };
  timestamp: Date;
  status: SosStatus;
  responders: mongoose.Types.ObjectId[];
}

const SosSchema = new Schema<ISosAlert>({
  family: { type: Schema.Types.ObjectId, ref: "Family", required: true },
  triggeredBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  coords: {
    lat: Number,
    lng: Number,
  },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["triggered", "acknowledged", "resolved"], default: "triggered" },
  responders: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export const SosAlert = mongoose.model<ISosAlert>("SosAlert", SosSchema);





// import mongoose, { Document, Schema } from "mongoose";

// export type SOSStatus = "triggered" | "acknowledged" | "resolved";

// export interface ISOSEvent extends Document {
//     userId: mongoose.Types.ObjectId;
//     familyId: mongoose.Types.ObjectId;
//     triggeredBy: mongoose.Types.ObjectId;
//     deviceId?: mongoose.Types.ObjectId;
//     coords: { lat: number; lng: number };
//     timestamp: Date;
//     status: SOSStatus;
//     responders: mongoose.Types.ObjectId[];
//     createdAt?: Date
// }

// const SOSEventSchema: Schema<ISOSEvent> = new Schema(
//     {
//         userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//         triggeredBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
//         familyId: { type: Schema.Types.ObjectId, ref: "Family", required: true },
//         deviceId: { type: Schema.Types.ObjectId, ref: "Device" },
//         coords: {
//         lat: { type: Number, required: true },
//         lng: { type: Number, required: true },
//         },
//         timestamp: { type: Date, default: () => new Date() },
//         createdAt: { type: Date, default: () => new Date() },
//         status: { type: String, enum: ["triggered", "acknowledged", "resolved"], default: "triggered" },
//         responders: [{ type: Schema.Types.ObjectId, ref: "User" }],
//     },
//     { timestamps: true }
// );

// export const SOSEvent = mongoose.model<ISOSEvent>("SOSEvent", SOSEventSchema);