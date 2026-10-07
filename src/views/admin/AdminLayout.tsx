import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminRoute } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminInventory } from './AdminInventory';
import { AdminCustomers } from './AdminCustomers';
import { AdminCoupons } from './AdminCoupons';
import { AdminReports } from './AdminReports';
import { AdminSettings } from './AdminSettings';

export const AdminLayout: React.FC = () => {
  const {
    adminRoute,
    navigateAdmin,
    setPortalMode,
    navigate,
    isAcceptingOrders,
    orders,
  } = useStore();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');

  const navItems: { label: string; route: AdminRoute; icon: string; badge?: number }[] = [
    { label: 'Dashboard', route: 'dashboard', icon: 'dashboard' },
    { label: 'Products', route: 'products', icon: 'inventory_2' },
    { label: 'Categories', route: 'categories', icon: 'category' },
    { label: 'Orders', route: 'orders', icon: 'receipt_long', badge: orders.length },
    { label: 'Inventory', route: 'inventory', icon: 'warehouse' },
    { label: 'Customers', route: 'customers', icon: 'group' },
  ];

  const growthItems: { label: string; route: AdminRoute; icon: string }[] = [
    { label: 'Offers & Coupons', route: 'offers-coupons', icon: 'loyalty' },
    { label: 'Reports', route: 'reports', icon: 'bar_chart' },
    { label: 'Settings', route: 'settings', icon: 'settings' },
  ];

  const renderActiveView = () => {
    switch (adminRoute) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProducts />;
      case 'categories':
        return <AdminCategories />;
      case 'orders':
        return <AdminOrders />;
      case 'inventory':
        return <AdminInventory />;
      case 'customers':
        return <AdminCustomers />;
      case 'offers-coupons':
        return <AdminCoupons />;
      case 'reports':
        return <AdminReports />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1f1b18] antialiased">
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-2xs"
        ></div>
      )}

      {/* LEFT SIDEBAR (Matching Image 3) */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[#342f2c] text-white z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.12)] transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
          {/* Brand header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#eae1db]/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#b43e2b] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[20px]">skillet</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg text-white tracking-tight leading-none font-bold">
                  Miras
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D49B24] leading-none mt-1">
                  Heritage Admin
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-[#eae1db] hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Store status pill */}
          <div className="px-4 py-3">
            <div className="p-2.5 rounded-lg bg-white/5 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isAcceptingOrders ? 'bg-[#2E7D32]' : 'bg-[#ba1a1a]'
                  }`}
                ></span>
                <span className="text-xs font-semibold text-[#f8efea]">Store Active</span>
              </div>
              <span className="text-[10px] font-bold text-[#ffb877] bg-[#6b3b00]/40 px-2 py-0.5 rounded">
                Live
              </span>
            </div>
          </div>

          {/* Section: Operations */}
          <div className="px-4 py-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#eae1db]/50 px-2">
              Operations
            </span>
          </div>

          <nav className="flex-1 px-3 space-y-1 mt-1">
            {navItems.map(item => {
              const isActive = adminRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => {
                    navigateAdmin(item.route);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#932616] text-white shadow-sm'
                      : 'text-[#eae1db]/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-[#b43e2b] text-white' : 'bg-white/20 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Section: Growth & System */}
            <div className="pt-3 pb-1 px-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#eae1db]/50">
                Growth & System
              </span>
            </div>

            {growthItems.map(item => {
              const isActive = adminRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => {
                    navigateAdmin(item.route);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#932616] text-white shadow-sm'
                      : 'text-[#eae1db]/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Hub Certificate */}
        <div className="p-3 bg-white/5 m-3 rounded-lg flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffdcc0] text-[18px]">verified</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#f8efea]">Origin Certified</span>
              <span className="text-[10px] text-[#eae1db]/60">FSSAI & GI Hub</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT WRAPPER (Shifted by 64 Tailwind cols on desktop) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* TOP ADMIN HEADER */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xl border-b border-[#E8E2DA] shadow-[0_1px_8px_rgba(0,0,0,0.04)] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 text-[#1f1b18] hover:text-[#932616]"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#696159] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={adminSearch}
                onChange={e => setAdminSearch(e.target.value)}
                placeholder="Search products, batch IDs, order records..."
                className="w-full h-9 pl-9 pr-3 bg-[#fbf2ec] rounded-lg text-xs text-[#1f1b18] placeholder:text-[#696159] outline-none focus:ring-1 focus:ring-[#932616]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Store Status Indicator */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#fbf2ec] px-3 py-1 rounded-lg border border-[#E8E2DA]">
              <span className="text-[11px] text-[#696159]">Store Status:</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white shadow-2xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAcceptingOrders ? 'bg-[#2E7D32]' : 'bg-[#ba1a1a]'
                  }`}
                ></span>
                <span className="text-xs font-bold text-[#1f1b18]">
                  {isAcceptingOrders ? 'Accepting Orders' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Back to Customer Storefront CTA */}
            <button
              onClick={() => {
                setPortalMode('store');
                navigate('home');
              }}
              className="h-9 px-3 bg-[#932616] hover:bg-[#b43e2b] text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">storefront</span>
              <span className="hidden sm:inline">Go to Storefront</span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-[#eae1db] hidden sm:block"></div>

            {/* Super Admin Profile Lockup */}
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-xs font-bold text-[#1f1b18] leading-tight">Rajesh Varma</span>
                <span className="text-[10px] text-[#932616] font-bold">Super Admin</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#932616] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <span className="material-symbols-outlined text-base">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="flex-1 py-4 bg-[#FAF8F5]">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
