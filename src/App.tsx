import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { CartView } from './views/CartView';
import { AuthCheckView } from './views/AuthCheckView';
import { CheckoutView } from './views/CheckoutView';
import { OrderSuccessView } from './views/OrderSuccessView';
import { ProductDetailView } from './views/ProductDetailView';
import { TrackOrderView } from './views/TrackOrderView';
import { OrderDetailsView } from './views/OrderDetailsView';
import { AdminLayout } from './views/admin/AdminLayout';
import { AdminLoginView } from './views/admin/AdminLoginView';

// Customer Storefront Layout (Includes Heritage Header & Footer)
const StorefrontLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5] text-[#1f1b18]">
      <Header />
      {/* Offset for sticky top header */}
      <main className="flex-1 pt-28 md:pt-36">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Admin Portal Wrapper (Isolated from general user access, requires authentication: Jeeva@admin / adminadmin)
const AdminPortalRoute: React.FC = () => {
  const { isAdminAuthenticated } = useStore();

  if (!isAdminAuthenticated) {
    return <AdminLoginView />;
  }

  return <AdminLayout />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route element={<StorefrontLayout />}>
        {/* Home Page (/) - Default landing route */}
        <Route path="/" element={<HomeView />} />

        {/* Cart Page (/cart) - Dedicated route for viewing and managing items in shopping cart */}
        <Route path="/cart" element={<CartView />} />

        {/* User Login Page (/login) - Route for user authentication */}
        <Route path="/login" element={<AuthCheckView />} />
        <Route path="/auth-check" element={<Navigate to="/login" replace />} />

        {/* Checkout Page (/checkout) - Dedicated route for order processing */}
        <Route path="/checkout" element={<CheckoutView />} />
        <Route path="/delivery-address" element={<Navigate to="/checkout" replace />} />

        {/* Order Tracking Page (/trackorder) - Route for checking order status */}
        <Route path="/trackorder" element={<TrackOrderView />} />
        <Route path="/track-order" element={<Navigate to="/trackorder" replace />} />

        {/* Order Details Page (/order/:ordernumber) - Dynamic route displaying specific order info */}
        <Route path="/order/:ordernumber" element={<OrderDetailsView />} />

        {/* Additional Storefront Routes */}
        <Route path="/product/:id" element={<ProductDetailView />} />
        <Route path="/order-success" element={<OrderSuccessView />} />

        {/* Category & Content Pages */}
        <Route path="/shop-all" element={<HomeView />} />
        <Route path="/regional-sweets" element={<HomeView />} />
        <Route path="/savouries-and-mixtures" element={<HomeView />} />
        <Route path="/handcrafted-pickles" element={<HomeView />} />
        <Route path="/millet-and-health" element={<HomeView />} />
        <Route path="/festive-hampers" element={<HomeView />} />
        <Route path="/about-us" element={<HomeView />} />
        <Route path="/contact" element={<HomeView />} />
      </Route>

      {/* Admin Login & Portal (/adminpage) - Completely isolated from general user access */}
      <Route path="/adminpage/*" element={<AdminPortalRoute />} />
      <Route path="/adminpage" element={<AdminPortalRoute />} />

      {/* Fallback - Unknown routes redirect to Home Page (/) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </BrowserRouter>
  );
}
