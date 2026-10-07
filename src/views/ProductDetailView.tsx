import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const ProductDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, selectedProductId, addToCart, navigate } = useStore();

  const targetId = id || selectedProductId;
  const product = products.find(p => p.id === targetId) || products[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(product.weight || '500g');
  const [addedToast, setAddedToast] = useState(false);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="w-full">
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#342f2c] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#ffdcc0]/20 animate-fade-in">
          <span className="material-symbols-outlined text-[#a3f69c] text-xl">check_circle</span>
          <span className="text-sm font-semibold">Added {quantity} × {product.name} to basket</span>
          <button
            onClick={() => navigate('cart')}
            className="ml-2 px-2.5 py-1 bg-[#932616] text-white text-xs font-bold rounded-lg hover:bg-[#b43e2b]"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Top Breadcrumb & Micro Notice */}
      <div className="w-full bg-[#fbf2ec] py-2.5 px-4 sm:px-8 border-b border-[#E8E2DA]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#696159]">
            <button
              onClick={() => navigate('home')}
              className="hover:text-[#932616] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <button
              onClick={() => navigate('shop-all')}
              className="hover:text-[#932616] transition-colors cursor-pointer"
            >
              {product.category}
            </button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-[#1f1b18] font-bold truncate max-w-xs md:max-w-none">
              {product.name}
            </span>
          </nav>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
            <span className="text-[11px] font-bold text-[#005c15] uppercase tracking-wider">
              Morning Batch Freshly Packed • Dispatches in 2 Hours
            </span>
          </div>
        </div>
      </div>

      {/* Main Showcase Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Visuals */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E2DA] aspect-square w-full group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[#8d4f00] text-xs font-bold shadow-sm">
                  <span
                    className="material-symbols-outlined text-sm text-[#D49B24]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    workspace_premium
                  </span>
                  GI Tagged Authenticity
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[#005c15] text-xs font-bold shadow-sm">
                  <span className="material-symbols-outlined text-sm text-[#2E7D32]">eco</span>
                  Zero Preservatives
                </span>
              </div>

              <div className="absolute bottom-4 right-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#932616] text-white text-xs font-bold shadow-md">
                  <span className="material-symbols-outlined text-xs">local_fire_department</span>
                  Fresh Batch Dispatched Daily
                </span>
              </div>
            </div>

            {/* Visual Trust Pillars Ribbon */}
            <div className="bg-[#fbf2ec] rounded-xl p-4 grid grid-cols-3 gap-2 text-center border border-[#ffdcc0]">
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-[#932616] mb-1">verified</span>
                <span className="text-sm font-bold text-[#1f1b18]">100%</span>
                <span className="text-[11px] text-[#696159]">Desi Cow Ghee</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-[#8d4f00] mb-1">timer</span>
                <span className="text-sm font-bold text-[#1f1b18]">4 Hours</span>
                <span className="text-[11px] text-[#696159]">Slow Bronze Stir</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-[#005c15] mb-1">health_and_safety</span>
                <span className="text-sm font-bold text-[#1f1b18]">Zero</span>
                <span className="text-[11px] text-[#696159]">Chemical Preservatives</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Commerce */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8d4f00] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  Handcrafted in {product.origin}
                </span>

                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-[#E8E2DA] shadow-2xs">
                  <div className="w-3.5 h-3.5 border-2 border-[#2E7D32] flex items-center justify-center p-0.5 rounded-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></div>
                  </div>
                  <span className="text-[11px] text-[#2E7D32] uppercase font-bold">Pure Veg</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1f1b18] tracking-tight">
                {product.name}
              </h1>

              {product.nativeTitle && (
                <p className="text-sm text-[#8d4f00] font-medium italic">
                  {product.nativeTitle}
                </p>
              )}

              {/* Reviews */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#E8E2DA]">
                  <span
                    className="material-symbols-outlined text-[#D49B24] text-base"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-xs font-bold text-[#1f1b18]">{product.rating}</span>
                </div>
                <span className="text-xs text-[#696159]">
                  ({product.reviewsCount} verified connoisseurs)
                </span>
                <span className="text-xs text-[#005c15] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  GI Origin Certified
                </span>
              </div>
            </div>

            {/* Price block */}
            <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] flex items-baseline justify-between">
              <div>
                <span className="font-serif text-3xl font-bold text-[#932616]">
                  ₹{product.price}
                </span>
                <span className="text-sm text-[#696159] line-through ml-2">
                  ₹{product.originalPrice}
                </span>
                <span className="ml-2 text-xs font-bold text-[#005c15] bg-[#a3f69c]/30 px-2 py-0.5 rounded">
                  Save ₹{product.originalPrice - product.price} (10% OFF)
                </span>
                <p className="text-[11px] text-[#696159] mt-0.5">
                  Taxes included • Free express shipping on orders &gt; ₹699
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#2E7D32]">In Stock</span>
                <span className="block text-[11px] text-[#696159]">
                  {product.stock} units remaining today
                </span>
              </div>
            </div>

            {/* Weight selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#1f1b18] uppercase tracking-wider">
                Select Package Weight:
              </span>
              <div className="flex gap-2">
                {[product.weight, '1 kg Brass Tin', '250g Sample'].map(w => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSelectedWeight(w)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedWeight === w
                        ? 'bg-[#932616] text-white border-[#932616]'
                        : 'bg-white border-[#E8E2DA] text-[#1f1b18] hover:bg-[#fbf2ec]'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Stepper & Add to Basket */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border border-[#E8E2DA] rounded-xl shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 flex items-center justify-center text-lg font-bold text-[#58413d] hover:text-[#932616] cursor-pointer"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-bold text-[#1f1b18]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-12 flex items-center justify-center text-lg font-bold text-[#58413d] hover:text-[#932616] cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 h-12 bg-[#932616] hover:bg-[#b43e2b] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-lg">shopping_bag</span>
                <span>Add to Artisanal Basket</span>
              </button>
            </div>

            {/* Culinary Details */}
            <div className="space-y-4 pt-4 border-t border-[#E8E2DA]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8d4f00]">
                  Heritage Formula Description
                </h3>
                <p className="text-xs text-[#58413d] leading-relaxed mt-1">
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8d4f00]">
                  Ingredients Transparency
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {product.ingredients.map(ing => (
                    <span
                      key={ing}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E8E2DA] text-xs text-[#1f1b18]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#696159] p-3 rounded-lg bg-[#FAF8F5]">
                <span>Shelf Life: <strong className="text-[#1f1b18]">{product.shelfLife}</strong></span>
                <span>Storage: <strong className="text-[#1f1b18]">Store in cool dry vessel</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
