import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CustomerRoute } from '../types';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigate,
    navigateAdmin,
    totalCartCount,
    currentUser,
    isAuthenticated,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks: { label: string; route: CustomerRoute }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Shop All', route: 'shop-all' },
    { label: 'Regional Sweets', route: 'regional-sweets' },
    { label: 'Savouries & Mixtures', route: 'savouries-and-mixtures' },
    { label: 'Handcrafted Pickles', route: 'handcrafted-pickles' },
    { label: 'Millet & Health', route: 'millet-and-health' },
    { label: 'About Us', route: 'about-us' },
    { label: 'Contact', route: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF] border-b border-[#E8E2DA] shadow-[0_4px_16px_rgba(31,27,24,0.06)]">
      {/* Top Heritage Notice Ribbon */}
      <div className="bg-[#932616] text-[#ffffff] py-1.5 px-4 text-center overflow-hidden">
        <p className="text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm text-[#ffdcc0]">verified</span>
          <span>
            Authentic Regional Indian Delicacies • Fresh Batches Dispatched Daily • Free Shipping on Orders above ₹699 • 100% Traditional & Preservative-Free
          </span>
        </p>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 md:h-24 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 md:gap-6">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#1f1b18] hover:text-[#932616] transition-colors"
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#b43e2b] flex items-center justify-center text-[#ffffff] shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">skillet</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl md:text-3xl text-[#932616] tracking-tight font-bold leading-tight">
                Miras
              </span>
              <span className="text-[11px] font-bold text-[#696159] tracking-wider uppercase -mt-1">
                Heritage Foods
              </span>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#696159] text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 150+ authentic native foods, sweets, murukku..."
              className="w-full h-11 pl-10 pr-4 bg-[#fff8f5] rounded-lg border border-[#E8E2DA] text-sm text-[#1f1b18] placeholder:text-[#696159] focus:outline-none focus:border-[#b43e2b] focus:ring-1 focus:ring-[#b43e2b] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#696159] hover:text-[#1f1b18]"
              >
                <span className="material-symbols-outlined text-base">cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-5 shrink-0">
          {/* Admin Switcher Pill */}
          <button
            onClick={() => navigateAdmin('dashboard')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#342f2c] text-[#f8efea] text-xs font-semibold hover:bg-[#1f1b18] transition-colors shadow-sm"
            title="Switch to Admin Operations Dashboard"
          >
            <span className="material-symbols-outlined text-base text-[#D49B24]">admin_panel_settings</span>
            <span className="hidden sm:inline">Admin Hub</span>
          </button>

          {/* Track Order */}
          <button
            onClick={() => navigate('track-order')}
            className="hidden lg:inline-flex items-center gap-1 text-sm font-semibold text-[#58413d] hover:text-[#932616] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#696159]">local_shipping</span>
            <span>Track Order</span>
          </button>

          {/* User Sign In / Profile Pill */}
          <div className="relative">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setProfileDropdownOpen(!profileDropdownOpen);
                } else {
                  navigate('auth-check');
                }
              }}
              className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#E8E2DA] cursor-pointer group"
            >
              {isAuthenticated && currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E8E2DA]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#ffdad4] flex items-center justify-center text-[#932616] font-bold text-xs">
                  {isAuthenticated ? currentUser?.name.slice(0, 2).toUpperCase() : <span className="material-symbols-outlined text-base">person</span>}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#1f1b18] group-hover:text-[#932616] transition-colors truncate max-w-[100px]">
                  {isAuthenticated ? currentUser?.name.split(' ')[0] : 'Sign In'}
                </span>
                <span className="text-[10px] text-[#696159]">
                  {isAuthenticated ? 'My Account' : 'Guest Active'}
                </span>
              </div>
            </button>

            {/* Profile Menu Dropdown */}
            {profileDropdownOpen && isAuthenticated && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E8E2DA] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#E8E2DA]">
                  <p className="text-xs font-bold text-[#1f1b18]">{currentUser?.name}</p>
                  <p className="text-[11px] text-[#696159] truncate">{currentUser?.email}</p>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-[#D49B24] font-semibold">
                    <span className="material-symbols-outlined text-sm">stars</span>
                    <span>{currentUser?.rewardCoins} Heritage Coins</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('delivery-address');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#1f1b18] hover:bg-[#fff8f5] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  Manage Addresses
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate('track-order');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#1f1b18] hover:bg-[#fff8f5] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">receipt_long</span>
                  My Orders History
                </button>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigateAdmin('dashboard');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#932616] font-semibold hover:bg-[#fff8f5] flex items-center gap-2 border-t border-[#E8E2DA]"
                >
                  <span className="material-symbols-outlined text-sm">store</span>
                  Admin Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Cart Primary CTA (Matches Image 1 & 5) */}
          <button
            onClick={() => navigate('cart')}
            className="inline-flex items-center gap-2 h-10 md:h-11 px-3 sm:px-4 bg-[#b43e2b] text-[#ffffff] rounded-lg text-sm font-semibold hover:bg-[#932616] transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">shopping_bag</span>
            <span>Cart ({totalCartCount})</span>
          </button>
        </div>
      </div>

      {/* Categories Sub-Navigation Bar */}
      <div className="border-t border-[#E8E2DA] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <nav className="flex items-center justify-between overflow-x-auto py-2 gap-4 md:gap-6 no-scrollbar">
            {navLinks.map(link => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    navigate(link.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`shrink-0 py-1 text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#932616] border-b-2 border-[#932616]'
                      : 'text-[#58413d] hover:text-[#1f1b18]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E8E2DA] px-4 py-4 space-y-3 shadow-lg">
          <div className="relative mb-3">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#696159] text-base">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search native foods..."
              className="w-full h-10 pl-9 pr-3 bg-[#fff8f5] rounded-lg border border-[#E8E2DA] text-xs text-[#1f1b18]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => {
                  navigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left ${
                  currentRoute === link.route
                    ? 'bg-[#932616] text-white font-bold'
                    : 'bg-[#FAF8F5] text-[#1f1b18] hover:bg-[#f6ece7]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E8E2DA] flex items-center justify-between">
            <button
              onClick={() => {
                navigate('track-order');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-[#58413d] flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">local_shipping</span>
              Track Order
            </button>
            <button
              onClick={() => {
                navigateAdmin('dashboard');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-[#932616] flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              Open Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
