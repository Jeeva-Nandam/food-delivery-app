import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, CategoryType } from '../../types';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for adding new product
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('Regional Sweets');
  const [origin, setOrigin] = useState('');
  const [weight, setWeight] = useState('500g');
  const [price, setPrice] = useState<number>(350);
  const [originalPrice, setOriginalPrice] = useState<number>(400);
  const [stock, setStock] = useState<number>(50);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const categoriesList: string[] = [
    'All',
    'Regional Sweets',
    'Savouries & Mixtures',
    'Handcrafted Pickles',
    'Millet & Health',
    'Festive Hampers',
  ];

  const filtered = products.filter(p => {
    const matchCat = selectedCat === 'All' || p.category === selectedCat;
    const matchSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.origin.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSaveNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    addProduct({
      name,
      category,
      origin: origin || 'Tamil Nadu',
      weight: weight || '500g',
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      stock: Number(stock),
      inStock: Number(stock) > 0,
      image:
        image ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD3kI2sWKEVtESP8ouCvMkACRksd7qIeCt7y7c68UwN1-mAxOZTIQt8706F7aoqDvB0YcG6dFh1Zg0Q-nC0iePIpl9o8lkQ8VxVTE95Xtk6d2Kdss-ue40DRekdGvtgQfdz4-5y56tFP2OFt3omKh4bI0h_fuEwEIwsz57hI1zs3ZklGB-vHep9xThAO1ewC0eD2GXPV7IHNvrYzrgQYSQ1Yxo8NpFsKqjc3oaA7KeWkmsPjx6dNuFB',
      description: description || 'Artisanal regional batch handcrafted by master confectioners.',
      ingredients: ['Pure Desi Cow Ghee', 'Raw Ingredients', 'Natural Spices'],
      shelfLife: '30 Days',
      badge: 'Artisanal Batch',
      rating: 4.8,
      reviewsCount: 1,
      isVeg: true,
    });
    // Reset form
    setName('');
    setOrigin('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-8 py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4f00]">
            Catalog Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f1b18]">
            Delicacies & Products ({products.length})
          </h1>
          <p className="text-xs text-[#696159]">
            Manage stock levels, update pricing, or add new regional specialties.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 px-4 bg-[#932616] hover:bg-[#b43e2b] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Add New Delicacy</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E8E2DA] flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#696159] text-base">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search delicacy by name or origin..."
            className="w-full h-9 pl-9 pr-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg text-xs text-[#1f1b18] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === cat
                  ? 'bg-[#932616] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#58413d] hover:bg-[#eae1db]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#E8E2DA] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#fbf2ec] text-[#696159] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Delicacy Item</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Origin Hub</th>
                <th className="py-3 px-3">Pack</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Stock Left</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2DA]">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#E8E2DA]"
                      />
                      <div>
                        <span className="font-bold text-[#1f1b18] block">{p.name}</span>
                        <span className="text-[10px] text-[#8d4f00]">{p.badge}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-semibold text-[#58413d]">{p.category}</td>
                  <td className="py-3 px-3 text-[#696159]">{p.origin}</td>
                  <td className="py-3 px-3 font-mono">{p.weight}</td>

                  <td className="py-3 px-3">
                    <span className="font-bold text-[#1f1b18]">₹{p.price}</span>
                    <span className="text-[10px] text-[#696159] line-through ml-1">
                      ₹{p.originalPrice}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        p.stock < 10
                          ? 'text-[#ba1a1a]'
                          : p.stock < 25
                          ? 'text-[#ffa03e]'
                          : 'text-[#2E7D32]'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() =>
                        updateProduct(p.id, {
                          inStock: !p.inStock,
                          stock: !p.inStock ? 20 : 0,
                        })
                      }
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                        p.inStock
                          ? 'bg-[#a3f69c]/30 text-[#005c15]'
                          : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1 text-[#58413d] hover:text-[#932616] transition-colors"
                        title="Edit Item"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1 text-[#696159] hover:text-[#ba1a1a] transition-colors"
                        title="Delete Item"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Delicacy Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2DA] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2DA]">
              <h3 className="font-serif text-lg font-bold text-[#1f1b18]">
                Add New Heritage Delicacy
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#696159] hover:text-[#1f1b18]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveNewProduct} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Delicacy Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Kumbakonam Degree Coffee Cookies"
                  required
                  className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1f1b18] block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as CategoryType)}
                    className="w-full h-10 px-2 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                  >
                    <option value="Regional Sweets">Regional Sweets</option>
                    <option value="Savouries & Mixtures">Savouries & Mixtures</option>
                    <option value="Handcrafted Pickles">Handcrafted Pickles</option>
                    <option value="Millet & Health">Millet & Health</option>
                    <option value="Festive Hampers">Festive Hampers</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1f1b18] block mb-1">Origin Cluster</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    placeholder="e.g. Kumbakonam, TN"
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#1f1b18] block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    required
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1f1b18] block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={e => setOriginalPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1f1b18] block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={e => setStock(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1f1b18] block mb-1">Pack Weight</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="e.g. 400g"
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1f1b18] block mb-1">Image URL (Optional)</label>
                  <input
                    type="text"
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    placeholder="Paste image URL"
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Traditional ingredients, wood fire preparation notes..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E2DA]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#932616] hover:bg-[#b43e2b] text-white rounded-lg font-bold"
                >
                  Publish Delicacy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2DA]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2DA]">
              <h3 className="font-serif text-lg font-bold text-[#1f1b18]">
                Edit {editingProduct.name}
              </h3>
              <button onClick={() => setEditingProduct(null)}>
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={e =>
                    setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                  }
                  className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Units in Stock</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={e =>
                    setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                  }
                  className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={editingProduct.badge || ''}
                  onChange={e =>
                    setEditingProduct({ ...editingProduct, badge: e.target.value })
                  }
                  className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2DA]">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-slate-100 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateProduct(editingProduct.id, {
                    price: editingProduct.price,
                    stock: editingProduct.stock,
                    badge: editingProduct.badge,
                    inStock: editingProduct.stock > 0,
                  });
                  setEditingProduct(null);
                }}
                className="px-5 py-2 bg-[#932616] text-white rounded-lg font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
