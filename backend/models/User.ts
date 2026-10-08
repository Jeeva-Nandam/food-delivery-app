import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAddress {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  avatar?: string;
  isVerified: boolean;
  role: 'customer' | 'admin';
  totalOrders: number;
  totalSpent: number;
  rewardCoins: number;
  addresses: IUserAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const UserAddressSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, default: '' },
    passwordHash: { type: String },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer', index: true },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    rewardCoins: { type: Number, default: 50 },
    addresses: { type: [UserAddressSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const UserModel =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
