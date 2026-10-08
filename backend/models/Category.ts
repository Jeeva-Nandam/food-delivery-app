import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  description: string;
  isActive: boolean;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, index: true },
    itemCount: { type: Number, default: 0 },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    icon: { type: String, default: 'bakery_dining' },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
