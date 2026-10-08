import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ProductModel } from '../models/Product';
import { CategoryModel } from '../models/Category';
import { OrderModel } from '../models/Order';
import { CouponModel } from '../models/Coupon';
import { SettingModel } from '../models/Setting';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
} from '../data/initialData';

dotenv.config();

async function runSeed() {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    console.error('❌ Cannot run seed: MONGODB_URI is not set in your .env file.');
    console.log('👉 Please add your MongoDB Atlas connection string to .env and run this script again.');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas for database seeding...');
    await mongoose.connect(uri);
    console.log('✅ Connected successfully!');

    console.log('🧹 Clearing existing collections...');
    await ProductModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await CouponModel.deleteMany({});
    await OrderModel.deleteMany({});
    await SettingModel.deleteMany({});

    console.log('📦 Seeding Products...');
    await ProductModel.insertMany(INITIAL_PRODUCTS);
    console.log(`   ✓ Seeded ${INITIAL_PRODUCTS.length} authentic delicacies`);

    console.log('📂 Seeding Categories...');
    await CategoryModel.insertMany(INITIAL_CATEGORIES);
    console.log(`   ✓ Seeded ${INITIAL_CATEGORIES.length} categories`);

    console.log('🎟️ Seeding Coupons...');
    await CouponModel.insertMany(INITIAL_COUPONS);
    console.log(`   ✓ Seeded ${INITIAL_COUPONS.length} discount coupons`);

    console.log('📑 Seeding Orders...');
    await OrderModel.insertMany(INITIAL_ORDERS);
    console.log(`   ✓ Seeded ${INITIAL_ORDERS.length} past order records`);

    console.log('⚙️ Seeding Store Settings...');
    await SettingModel.create({
      key: 'store_config',
      isAcceptingOrders: true,
      freeShippingThreshold: 699,
      flatShippingRate: 80,
      announcementText:
        'Authentic Regional Indian Delicacies • Fresh Batches Dispatched Daily • Free Shipping on Orders above ₹699 • 100% Traditional & Preservative-Free',
    });
    console.log('   ✓ Seeded default store configuration');

    console.log('\n🎉 [Success] MongoDB Atlas successfully initialized and seeded with all data!');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

runSeed();
