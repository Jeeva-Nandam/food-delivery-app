import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  name: string;
  nativeTitle?: string;
  category: string;
  origin: string;
  weight: string;
  price: number;
  originalPrice: number;
  description: string;
  ingredients: string[];
  shelfLife: string;
  image: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  isVeg: boolean;
  stock: number;
  inStock: boolean;
  isTopSeller?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    nativeTitle: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    origin: { type: String, required: true },
    weight: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    ingredients: { type: [String], default: [] },
    shelfLife: { type: String, default: '30 Days' },
    image: { type: String, required: true },
    badge: { type: String, default: '' },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 120 },
    isVeg: { type: Boolean, default: true },
    stock: { type: Number, default: 100, min: 0 },
    inStock: { type: Boolean, default: true },
    isTopSeller: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const ProductModel =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
