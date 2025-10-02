import mongoose, { Document, Schema } from "mongoose";

export interface IGeofence extends Document {
    familyId: mongoose.Types.ObjectId;
    name: string;
    center: { lat: number; lng: number };
    radiusMeters: number;
    type: "safe" | "danger";
}

const GeofenceSchema: Schema<IGeofence> = new Schema(
    {
        familyId: { type: Schema.Types.ObjectId, ref: "Family", required: true },
        name: { type: String, required: true },
        center: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        },
        radiusMeters: { type: Number, required: true },
        type: { type: String, enum: ["safe", "danger"], default: "safe" },
    },
    { timestamps: true }
);

export const Geofence = mongoose.model<IGeofence>("Geofence", GeofenceSchema);