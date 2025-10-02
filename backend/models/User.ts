// backend/src/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  avatarUrl?: string;
  lastActiveAt?: Date;
  family?: mongoose.Types.ObjectId | null;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String },
  lastActiveAt: { type: Date },
  family: { type: Schema.Types.ObjectId, ref: "Family", default: null },
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", UserSchema);



// import mongoose, { Document, Schema } from "mongoose";

// export interface IUser extends Document {
//     name: string;
//     phone?: string;
//     email?: string;
//     password?: string;
//     avatarUrl?: string;
//     createdAt?: Date;
//     pushToken?: string;
//     lastActiveAt?: Date;
//     family?: mongoose.Types.ObjectId | null;
// }

// const UserSchema: Schema<IUser> = new Schema(
//     {
//         name: { type: String, required: true },
//         phone: { type: String },
//         email: { type: String, unique: true, sparse: true },
//         password: { type: String },
//         avatarUrl: { type: String },
//         lastActiveAt: { type: Date },
//         pushToken: {type: String},
//         family: { type: Schema.Types.ObjectId, ref: "Family", default: null },
//     },
//     { timestamps: true }
// );

// export const User = mongoose.model<IUser>("User", UserSchema);