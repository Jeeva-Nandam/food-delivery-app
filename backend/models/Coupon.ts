import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
  isActive: boolean;
  timesUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    maxDiscount: { type: Number, required: true, min: 0 },
    minOrder: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    timesUsed: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const CouponModel =
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
