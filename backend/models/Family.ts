// backend/src/models/Family.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IFamily extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  inviteCode: string;
  settings: {
    autoCallOnSOS: boolean;
    broadcastSMS: boolean;
  };
}

const FamilySchema = new Schema<IFamily>({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  inviteCode: { type: String, required: true, unique: true },
  settings: {
    autoCallOnSOS: { type: Boolean, default: false },
    broadcastSMS: { type: Boolean, default: false },
  },
}, { timestamps: true });

export const Family = mongoose.model<IFamily>("Family", FamilySchema);




// import mongoose, { Document, Schema } from "mongoose";

// interface IFamilySettings {
//     autoCallOnSOS: boolean;
//     broadcastSMS: boolean;
// }

// export interface IFamily extends Document {
//     name: string;
//     ownerUserId: mongoose.Types.ObjectId;
//     members: mongoose.Types.ObjectId[];
//     inviteCode: string;
//     settings: IFamilySettings;
//     createdAt?: Date;
//     updatedAt?: Date;
// }

// const FamilySchema: Schema<IFamily> = new Schema(
//     {
//         name: { type: String, required: true },
//         ownerUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//         members: [{ type: Schema.Types.ObjectId, ref: "User" }],
//         inviteCode: { type: String },
//         settings: {
//         autoCallOnSOS: { type: Boolean, default: false },
//         broadcastSMS: { type: Boolean, default: true },
//         },
//     },
//     { timestamps: true }
// );

// export const Family = mongoose.model<IFamily>("Family", FamilySchema);