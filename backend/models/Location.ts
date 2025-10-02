// backend/src/models/Location.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ILocation extends Document {
  user: mongoose.Types.ObjectId;
  coords: { lat: number; lng: number };
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: Date;
}

const LocationSchema = new Schema<ILocation>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  coords: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  accuracy: Number,
  speed: Number,
  heading: Number,
  timestamp: { type: Date, default: Date.now },
});

LocationSchema.index({ "timestamp": -1 });

export const Location = mongoose.model<ILocation>("Location", LocationSchema);




// import mongoose, { Document, Schema } from "mongoose";

// export interface ILocation extends Document {
//     userId: mongoose.Types.ObjectId;
//     deviceId?: mongoose.Types.ObjectId;
//     coords: { lat: number; lng: number };
//     accuracy?: number;
//     speed?: number;
//     heading?: number;
//     timestamp: Date;
//     user: string
// }

// const LocationSchema: Schema<ILocation> = new Schema(
//     {
//         userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//         deviceId: { type: Schema.Types.ObjectId, ref: "Device" },
//         coords: {
//         lat: { type: Number, required: true },
//         lng: { type: Number, required: true },
//         },
//         accuracy: { type: Number },
//         speed: { type: Number },
//         heading: { type: Number },
//         timestamp: { type: Date, default: () => new Date() },
//     },
//     { timestamps: true }
// );

// // example TTL index - store detailed locations for 7 days by default
// LocationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

// export const Location = mongoose.model<ILocation>("Location", LocationSchema);