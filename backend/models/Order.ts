import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  weight: string;
  image: string;
}

export interface IOrderAddress {
  id?: string;
  title: string;
  recipientName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface IOrder extends Document {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;

  // Payment details & gateway telemetry
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  paymentGateway: 'razorpay' | 'cashfree' | 'cod' | 'manual';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentDetails?: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  paidAt?: Date;

  // Fulfillment & tracking
  status: 'New' | 'Preparing' | 'Dispatched' | 'Delivered' | 'Cancelled';
  deliveryAddress: IOrderAddress;
  deliveryNotes?: string;
  trackingId?: string;
  isGIDirect?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    weight: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const OrderAddressSchema: Schema = new Schema(
  {
    id: { type: String },
    title: { type: String, default: 'Delivery Address' },
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: true },
  },
  { _id: false }
);

const OrderSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, index: true },
    customerPhone: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },

    // Payment details
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Card', 'NetBanking', 'Cash on Delivery'],
      default: 'UPI',
    },
    paymentGateway: {
      type: String,
      enum: ['razorpay', 'cashfree', 'cod', 'manual'],
      default: 'manual',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PAID',
    },
    paymentDetails: { type: String, default: '' },
    gatewayOrderId: { type: String, default: '' },
    gatewayPaymentId: { type: String, default: '' },
    gatewaySignature: { type: String, default: '' },
    paidAt: { type: Date },

    // Fulfillment & tracking
    status: {
      type: String,
      enum: ['New', 'Preparing', 'Dispatched', 'Delivered', 'Cancelled'],
      default: 'New',
      index: true,
    },
    deliveryAddress: { type: OrderAddressSchema, required: true },
    deliveryNotes: { type: String, default: '' },
    trackingId: { type: String, default: '' },
    isGIDirect: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const OrderModel =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
