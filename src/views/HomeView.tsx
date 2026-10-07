import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, CategoryType } from '../types';

export const HomeView: React.FC = () => {
  const { products, addToCart, navigate, searchQuery } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const categories: string[] = [
    'All',
    'Regional Sweets',
    'Savouries & Mixtures',
    'Handcrafted Pickles',
    'Millet & Health',
  ];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedToast(`Added ${product.name} to your basket`);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#342f2c] text-[#ffffff] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#ffdcc0]/20 animate-fade-in">
          <span className="material-symbols-outlined text-[#a3f69c] text-xl">check_circle</span>
          <span className="text-sm font-semibold">{addedToast}</span>
          <button
            onClick={() => navigate('cart')}
            className="ml-2 px-2.5 py-1 bg-[#932616] text-[#ffffff] text-xs font-bold rounded-lg hover:bg-[#b43e2b]"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Editorial Hero Showcase */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf2ec] to-[#fff8f5] border-b border-[#E8E2DA] pt-8 pb-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#ffdcc0]/50 text-[#8d4f00] text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm text-[#D49B24]">verified</span>
                Direct from Native Masters • Heritage Clusters
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1f1b18] font-bold tracking-tight leading-[1.15]">
                Reviving India’s Lost Culinary Legacies.
              </h1>

              <p className="text-base sm:text-lg text-[#696159] leading-relaxed max-w-2xl">
                Directly sourced from indigenous artisans of Tirunelveli, Manapparai, Madurai & Guntur.
                Crafted in small micro-batches with pure A2 cow ghee, Thamirabarani waters, and zero preservatives.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('cart')}
                  className="h-12 px-6 bg-[#932616] hover:bg-[#b43e2b] text-[#ffffff] rounded-xl text-sm font-bold tracking-wide flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>Explore Pantry Basket</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>

                <button
                  onClick={() => navigate('shop-all')}
                  className="h-12 px-6 bg-white hover:bg-[#f6ece7] text-[#1f1b18] border border-[#E8E2DA] rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
                  View All Delicacies
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E8E2DA]/80">
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold text-[#932616]">100%</span>
                  <span className="text-xs text-[#696159]">Preservative-Free</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold text-[#8d4f00]">24h</span>
                  <span className="text-xs text-[#696159]">Fresh Batch Dispatch</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold text-[#005c15]">GI Tag</span>
                  <span className="text-xs text-[#696159]">Geographic Provenance</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#ffffff] border-4 border-white">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3kI2sWKEVtESP8ouCvMkACRksd7qIeCt7y7c68UwN1-mAxOZTIQt8706F7aoqDvB0YcG6dFh1Zg0Q-nC0iePIpl9o8lkQ8VxVTE95Xtk6d2Kdss-ue40DRekdGvtgQfdz4-5y56tFP2OFt3omKh4bI0h_fuEwEIwsz57hI1zs3ZklGB-vHep9xThAO1ewC0eD2GXPV7IHNvrYzrgQYSQ1Yxo8NpFsKqjc3oaA7KeWkmsPjx6dNuFB"
                  alt="Original Tirunelveli Wheat Halwa"
                  className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[#8d4f00] text-xs font-bold shadow-sm">
                    Featured Delicacy
                  </span>
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
                  <p className="text-xs font-bold text-[#ffdcc0] uppercase tracking-wider">
                    Tirunelveli, Tamil Nadu
                  </p>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Original Tirunelveli Wheat Halwa
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-white">₹450 <span className="text-xs line-through text-white/70">₹500</span></span>
                    <button
                      onClick={() => handleAddToCart(products[0])}
                      className="px-3 py-1.5 bg-[#932616] hover:bg-[#b43e2b] text-white text-xs font-bold rounded-lg shadow cursor-pointer"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-14">
        {/* Category Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8d4f00]">
              Artisanal Selection
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1f1b18] tracking-tight mt-0.5">
              Indigenous Delicacies
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-[#f6ece7] rounded-xl no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-[#932616] shadow-sm font-bold'
                    : 'text-[#58413d] hover:text-[#1f1b18]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-[#E8E2DA] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-[4/3] bg-[#fbf2ec] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Veg Indicator */}
                <div className="absolute top-3 left-3 w-4 h-4 bg-white rounded-xs flex items-center justify-center p-0.5 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#2E7D32]"></div>
                </div>

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/95 backdrop-blur text-[#8d4f00] shadow-sm">
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#696159] mb-1">
                    <span>{product.origin}</span>
                    <span className="font-semibold">{product.weight}</span>
                  </div>

                  <h3
                    onClick={() => navigate('product-detail', { productId: product.id })}
                    className="font-serif text-base font-bold text-[#1f1b18] group-hover:text-[#932616] transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#696159] mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price & Add to Cart */}
                <div className="pt-2 border-t border-[#f6ece7] flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-[#1f1b18]">
                      ₹{product.price}
                    </span>
                    <span className="text-xs text-[#696159] line-through ml-1.5">
                      ₹{product.originalPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-3.5 py-1.5 bg-[#b43e2b] hover:bg-[#932616] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-[#E8E2DA] p-8">
            <span className="material-symbols-outlined text-4xl text-[#696159] mb-2">inventory_2</span>
            <p className="text-base font-bold text-[#1f1b18]">No delicacies found</p>
            <p className="text-xs text-[#696159] mt-1">Try adjusting your category or search query.</p>
          </div>
        )}
      </section>

      {/* Heritage Craftsmanship Story Section */}
      <section className="bg-[#FAF8F5] border-y border-[#E8E2DA] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8d4f00]">
              The Miras Philosophy
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1f1b18] mt-1">
              Pure Ingredients. No Shortcuts.
            </h2>
            <p className="text-sm text-[#696159] mt-2">
              Every package is prepared by traditional culinary families with original generational recipes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-[#E8E2DA] shadow-sm flex flex-col gap-3">
              <span className="material-symbols-outlined text-[#8d4f00] text-3xl">history_edu</span>
              <h3 className="font-serif text-lg font-bold text-[#1f1b18]">Native Recipes</h3>
              <p className="text-xs text-[#696159] leading-relaxed">
                Handcrafted using multigenerational secret formulas preserved across centuries in family-run koodams.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8E2DA] shadow-sm flex flex-col gap-3">
              <span className="material-symbols-outlined text-[#005c15] text-3xl">spa</span>
              <h3 className="font-serif text-lg font-bold text-[#1f1b18]">Zero Artificials</h3>
              <p className="text-xs text-[#696159] leading-relaxed">
                Zero chemical preservatives, synthetic colors, palm oil, or adulterated essences. Only pure A2 cow ghee and cold-pressed oils.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8E2DA] shadow-sm flex flex-col gap-3">
              <span className="material-symbols-outlined text-[#D49B24] text-3xl">inventory_2</span>
              <h3 className="font-serif text-lg font-bold text-[#1f1b18]">Fresh Batches</h3>
              <p className="text-xs text-[#696159] leading-relaxed">
                Small batch churned daily and hermetically nitrogen-packed within 48 hours of dispatch for peerless freshness.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
