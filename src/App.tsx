import React from 'react';
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
import { AdminLayout } from './views/admin/AdminLayout';

const MainContent: React.FC = () => {
  const { portalMode, currentRoute } = useStore();

  // If in dedicated admin mode, render the Admin shell
  if (portalMode === 'admin') {
    return <AdminLayout />;
  }

  // Customer Storefront views
  const renderCustomerView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView />;
      case 'cart':
        return <CartView />;
      case 'delivery-address':
      case 'checkout':
        return <CheckoutView />;
      case 'auth-check':
        return <AuthCheckView />;
      case 'order-success':
        return <OrderSuccessView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'track-order':
        return <TrackOrderView />;
      case 'shop-all':
      case 'regional-sweets':
      case 'savouries-and-mixtures':
      case 'handcrafted-pickles':
      case 'millet-and-health':
        return <HomeView />;
      case 'about-us':
      case 'contact':
        return <HomeView />;
      default:
        return <CartView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f5] text-[#1f1b18]">
      <Header />
      {/* Offset for sticky top header */}
      <main className="flex-1 pt-28 md:pt-36">
        {renderCustomerView()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
