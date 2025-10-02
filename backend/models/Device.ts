import mongoose, { Document, Schema } from "mongoose";

export interface IDevice extends Document {
    userId: mongoose.Types.ObjectId;
    platform: "ios" | "android" | "web";
    pushToken?: string;
    lastKnownBattery?: number;
    lastSeenAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const DeviceSchema: Schema<IDevice> = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        platform: { type: String, enum: ["ios", "android", "web"], required: true },
        pushToken: { type: String },
        lastKnownBattery: { type: Number },
        lastSeenAt: { type: Date },
    },
    { timestamps: true }
);

export const Device = mongoose.model<IDevice>("Device", DeviceSchema);