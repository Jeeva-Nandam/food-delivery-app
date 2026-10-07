export type CategoryType = 
  | 'Regional Sweets'
  | 'Savouries & Mixtures'
  | 'Handcrafted Pickles'
  | 'Millet & Health'
  | 'Festive Hampers';

export interface Product {
  id: string;
  name: string;
  nativeTitle?: string;
  category: CategoryType;
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
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
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

export type OrderStatus = 'New' | 'Preparing' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  weight: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  paymentDetails?: string;
  status: OrderStatus;
  deliveryAddress: Address;
  deliveryNotes?: string;
  trackingId?: string;
  isGIDirect?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isVerified: boolean;
  role: 'customer' | 'admin';
  totalOrders: number;
  totalSpent: number;
  rewardCoins: number;
  addresses: Address[];
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
  isActive: boolean;
  timesUsed: number;
}

export interface CategoryInfo {
  id: string;
  name: CategoryType;
  slug: string;
  itemCount: number;
  description: string;
  isActive: boolean;
  icon: string;
}

export type CustomerRoute =
  | 'home'
  | 'shop-all'
  | 'cart'
  | 'delivery-address'
  | 'auth-check'
  | 'login'
  | 'checkout'
  | 'order-success'
  | 'order-details'
  | 'product-detail'
  | 'track-order'
  | 'regional-sweets'
  | 'savouries-and-mixtures'
  | 'handcrafted-pickles'
  | 'millet-and-health'
  | 'about-us'
  | 'contact';

export type AdminRoute =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'inventory'
  | 'customers'
  | 'offers-coupons'
  | 'reports'
  | 'settings';
