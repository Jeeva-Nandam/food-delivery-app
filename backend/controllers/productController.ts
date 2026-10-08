import { Request, Response } from 'express';
import { ProductModel, IProduct } from '../models/Product';
import { connectDB, isConnected } from '../config/db';
import { INITIAL_PRODUCTS } from '../data/initialData';

// Memory fallback store if MongoDB Atlas is not yet connected
let memoryProducts: any[] = [...INITIAL_PRODUCTS];

// Auto-seed helper if collection is empty
async function ensureProductsSeeded() {
  if (isConnected()) {
    const count = await ProductModel.countDocuments();
    if (count === 0) {
      console.log('🌱 [MongoDB] Seeding initial products into MongoDB collection...');
      await ProductModel.insertMany(INITIAL_PRODUCTS);
      console.log('✅ [MongoDB] Products seeded successfully.');
    }
  }
}

/**
 * GET /api/products
 * Fetch all products with optional ?category= and ?search= filters
 */
export async function getProducts(req: Request, res: Response) {
  try {
    await connectDB();

    const { category, search } = req.query;

    if (isConnected()) {
      await ensureProductsSeeded();

      const query: any = {};
      if (category && typeof category === 'string' && category !== 'All') {
        query.category = category;
      }
      if (search && typeof search === 'string' && search.trim()) {
        query.$or = [
          { name: { $regex: search.trim(), $options: 'i' } },
          { nativeTitle: { $regex: search.trim(), $options: 'i' } },
          { origin: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
        ];
      }

      const products = await ProductModel.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: products.length, data: products });
    }

    // Memory fallback
    let results = [...memoryProducts];
    if (category && typeof category === 'string' && category !== 'All') {
      results = results.filter(p => p.category === category);
    }
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q) ||
          (p.nativeTitle && p.nativeTitle.toLowerCase().includes(q))
      );
    }

    return res.json({ success: true, count: results.length, data: results, isFallback: true });
  } catch (err: any) {
    console.error('Error in getProducts:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * GET /api/products/:id
 * Fetch single product by id
 */
export async function getProductById(req: Request, res: Response) {
  try {
    await connectDB();
    const { id } = req.params;

    if (isConnected()) {
      const product = await ProductModel.findOne({ id });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: product });
    }

    const product = memoryProducts.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, data: product });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/admin/products
 * Admin creates a new product
 */
export async function createProduct(req: Request, res: Response) {
  try {
    await connectDB();
    const productData = req.body;

    if (!productData.name || !productData.price || !productData.category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required fields.',
      });
    }

    const newId = productData.id || `prod-${Date.now()}`;
    const newProduct = {
      ...productData,
      id: newId,
      inStock: productData.stock !== undefined ? productData.stock > 0 : true,
    };

    if (isConnected()) {
      const created = await ProductModel.create(newProduct);
      return res.status(201).json({ success: true, data: created });
    }

    memoryProducts.unshift(newProduct);
    return res.status(201).json({ success: true, data: newProduct });
  } catch (err: any) {
    console.error('Error creating product:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * PUT /api/admin/products/:id
 * Admin updates existing product
 */
export async function updateProduct(req: Request, res: Response) {
  try {
    await connectDB();
    const { id } = req.params;
    const updates = req.body;

    if (updates.stock !== undefined) {
      updates.inStock = Number(updates.stock) > 0;
    }

    if (isConnected()) {
      const updated = await ProductModel.findOneAndUpdate({ id }, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: updated });
    }

    const index = memoryProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    memoryProducts[index] = { ...memoryProducts[index], ...updates };
    return res.json({ success: true, data: memoryProducts[index] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * DELETE /api/admin/products/:id
 * Admin removes product
 */
export async function deleteProduct(req: Request, res: Response) {
  try {
    await connectDB();
    const { id } = req.params;

    if (isConnected()) {
      const deleted = await ProductModel.findOneAndDelete({ id });
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, message: 'Product deleted successfully', data: deleted });
    }

    const index = memoryProducts.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const [deleted] = memoryProducts.splice(index, 1);
    return res.json({ success: true, message: 'Product deleted successfully', data: deleted });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
