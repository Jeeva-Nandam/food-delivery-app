import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CategoryType } from '../../types';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, deleteCategory, toggleCategoryActive } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('category');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    addCategory({
      name: name as CategoryType,
      slug,
      itemCount: 0,
      description: description || 'Artisanal regional category collection.',
      isActive: true,
      icon: icon || 'category',
    });
    setName('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-8 py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4f00]">
            Store Taxonomy
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f1b18]">
            Categories Management
          </h1>
          <p className="text-xs text-[#696159]">
            Organize catalog into authentic culinary clusters and manage active storefront status.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 px-4 bg-[#932616] hover:bg-[#b43e2b] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-[#E8E2DA] p-5 shadow-xs flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fbf2ec] text-[#932616] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#1f1b18]">{cat.name}</h3>
                  <span className="text-[11px] text-[#696159] font-mono">/{cat.slug}</span>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  cat.isActive ? 'bg-[#a3f69c]/30 text-[#005c15]' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat.isActive ? 'Active' : 'Disabled'}
              </span>
            </div>

            <p className="text-xs text-[#696159] leading-relaxed">{cat.description}</p>

            <div className="pt-3 border-t border-[#E8E2DA] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1f1b18]">{cat.itemCount} Delicacies</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleCategoryActive(cat.id)}
                  className="text-xs font-bold text-[#932616] hover:underline cursor-pointer"
                >
                  {cat.isActive ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
                      deleteCategory(cat.id);
                    }
                  }}
                  className="p-1 text-[#696159] hover:text-[#ba1a1a] transition-colors cursor-pointer"
                  title="Delete Category"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2DA]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2DA]">
              <h3 className="font-serif text-lg font-bold text-[#1f1b18]">Add New Category</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Category Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Traditional Podis & Masalas"
                  required
                  className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Icon Identifier</label>
                <select
                  value={icon}
                  onChange={e => setIcon(e.target.value)}
                  className="w-full h-10 px-2 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                >
                  <option value="bakery_dining">Bakery Dining</option>
                  <option value="ramen_dining">Ramen Dining</option>
                  <option value="soup_kitchen">Soup Kitchen</option>
                  <option value="grass">Grass / Organic</option>
                  <option value="featured_seasonal_and_gifts">Gifts & Hampers</option>
                  <option value="coffee">Coffee / Beverages</option>
                  <option value="local_dining">Local Dining</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Short description for storefront category banner..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2DA]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#932616] text-white rounded-lg font-bold"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
