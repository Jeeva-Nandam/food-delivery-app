import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  isAcceptingOrders: boolean;
  freeShippingThreshold: number;
  flatShippingRate: number;
  announcementText: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'store_config' },
    isAcceptingOrders: { type: Boolean, default: true },
    freeShippingThreshold: { type: Number, default: 699 },
    flatShippingRate: { type: Number, default: 80 },
    announcementText: {
      type: String,
      default:
        'Authentic Regional Indian Delicacies • Fresh Batches Dispatched Daily • Free Shipping on Orders above ₹699 • 100% Traditional & Preservative-Free',
    },
  },
  {
    timestamps: true,
  }
);

export const SettingModel =
  mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
