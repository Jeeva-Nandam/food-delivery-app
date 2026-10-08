import { Request, Response } from 'express';
import { CategoryModel } from '../models/Category';
import { connectDB, isConnected } from '../config/db';
import { INITIAL_CATEGORIES } from '../data/initialData';

let memoryCategories: any[] = [...INITIAL_CATEGORIES];

async function ensureCategoriesSeeded() {
  if (isConnected()) {
    const count = await CategoryModel.countDocuments();
    if (count === 0) {
      console.log('🌱 [MongoDB] Seeding initial categories into MongoDB collection...');
      await CategoryModel.insertMany(INITIAL_CATEGORIES);
      console.log('✅ [MongoDB] Categories seeded successfully.');
    }
  }
}

/**
 * GET /api/categories
 * List all categories
 */
export async function getCategories(req: Request, res: Response) {
  try {
    await connectDB();

    if (isConnected()) {
      await ensureCategoriesSeeded();
      const categories = await CategoryModel.find({}).sort({ createdAt: 1 });
      return res.json({ success: true, count: categories.length, data: categories });
    }

    return res.json({ success: true, count: memoryCategories.length, data: memoryCategories });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/admin/categories
 * Admin creates new category
 */
export async function createCategory(req: Request, res: Response) {
  try {
    await connectDB();
    const catData = req.body;

    if (!catData.name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug =
      catData.slug ||
      catData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    const newCat = {
      ...catData,
      id: catData.id || `cat-${Date.now()}`,
      slug,
      isActive: catData.isActive !== undefined ? catData.isActive : true,
    };

    if (isConnected()) {
      const created = await CategoryModel.create(newCat);
      return res.status(201).json({ success: true, data: created });
    }

    memoryCategories.push(newCat);
    return res.status(201).json({ success: true, data: newCat });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * PUT /api/admin/categories/:id
 * Admin updates category (e.g. toggle active or edit details)
 */
export async function updateCategory(req: Request, res: Response) {
  try {
    await connectDB();
    const { id } = req.params;
    const updates = req.body;

    if (isConnected()) {
      const updated = await CategoryModel.findOneAndUpdate({ id }, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      return res.json({ success: true, data: updated });
    }

    const index = memoryCategories.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    memoryCategories[index] = { ...memoryCategories[index], ...updates };
    return res.json({ success: true, data: memoryCategories[index] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * DELETE /api/admin/categories/:id
 * Admin deletes category
 */
export async function deleteCategory(req: Request, res: Response) {
  try {
    await connectDB();
    const { id } = req.params;

    if (isConnected()) {
      const deleted = await CategoryModel.findOneAndDelete({ id });
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      return res.json({ success: true, message: 'Category deleted', data: deleted });
    }

    const index = memoryCategories.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    const [deleted] = memoryCategories.splice(index, 1);
    return res.json({ success: true, message: 'Category deleted', data: deleted });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
