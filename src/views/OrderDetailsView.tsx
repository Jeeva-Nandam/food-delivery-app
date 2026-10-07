import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';

export const OrderDetailsView: React.FC = () => {
  const { ordernumber } = useParams<{ ordernumber: string }>();
  const navigateRouter = useNavigate();
  const { orders } = useStore();
  const [searchInput, setSearchInput] = useState('');

  const rawParam = decodeURIComponent(ordernumber || '').trim();
  const normalize = (val: string) => val.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const targetId = normalize(rawParam);

  const order = orders.find(o => {
    const normOrderNum = normalize(o.orderNumber);
    const normId = normalize(o.id);
    return (
      normOrderNum === targetId ||
      normId === targetId ||
      normOrderNum.endsWith(targetId) ||
      targetId.endsWith(normOrderNum)
    );
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const cleanSearch = searchInput.trim().replace(/^#/, '');
      navigateRouter(`/order/${encodeURIComponent(cleanSearch)}`);
    }
  };

  if (!order) {
    return (
      <div className="w-full py-12 md:py-20 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#fbf2ec] text-[#932616] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-4xl">receipt_long</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8d4f00]">
            Order Lookup
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1f1b18] mt-1">
            Order Not Found
          </h1>
          <p className="text-sm text-[#696159] mt-2 max-w-md">
            We couldn't locate an order with identifier <span className="font-mono font-bold text-[#1f1b18]">"{rawParam}"</span> in our active registry.
          </p>

          {/* Quick Search Form */}
          <form onSubmit={handleSearchSubmit} className="mt-6 w-full max-w-md flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="e.g. MHF-8821 or 8821"
              className="flex-1 h-11 px-4 bg-white border border-[#E8E2DA] rounded-xl text-sm font-mono text-[#1f1b18] focus:outline-none focus:border-[#932616]"
            />
            <button
              type="submit"
              className="h-11 px-5 bg-[#932616] hover:bg-[#b43e2b] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-4 mt-8">
            <Link
              to="/trackorder"
              className="px-4 py-2.5 bg-white border border-[#E8E2DA] hover:bg-[#FAF8F5] text-xs font-bold text-[#1f1b18] rounded-xl transition-colors"
            >
              Order Tracking Page
            </Link>
            <Link
              to="/"
              className="px-4 py-2.5 bg-[#932616] text-white hover:bg-[#b43e2b] text-xs font-bold rounded-xl transition-colors"
            >
              Return to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return 'bg-[#932616] text-white';
      case 'Preparing':
        return 'bg-[#ffa03e] text-[#1f1b18]';
      case 'Dispatched':
        return 'bg-[#005c15] text-white';
      case 'Delivered':
        return 'bg-[#2E7D32]/20 text-[#2E7D32] border border-[#2E7D32]/30';
      case 'Cancelled':
        return 'bg-[#ba1a1a] text-white';
      default:
        return 'bg-[#eae1db] text-[#58413d]';
    }
  };

  return (
    <div className="w-full py-8 md:py-14 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#696159]">
          <Link to="/" className="hover:text-[#932616] transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to="/trackorder" className="hover:text-[#932616] transition-colors">
            Order Tracking
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-[#1f1b18] font-bold font-mono">{order.orderNumber}</span>
        </div>

        {/* Top Order Summary Card */}
        <div className="bg-white rounded-2xl border border-[#E8E2DA] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f1b18] font-mono">
                {order.orderNumber}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-[#696159]">
              Placed on <span className="font-semibold text-[#1f1b18]">{order.createdAt}</span> • Air Express Direct Dispatch
            </p>
            {order.trackingId && (
              <p className="text-xs font-mono text-[#005c15] font-semibold flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                AWB Tracking ID: {order.trackingId}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white border border-[#E8E2DA] hover:bg-[#FAF8F5] text-xs font-bold text-[#1f1b18] rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Print Invoice</span>
            </button>
            <Link
              to="/trackorder"
              className="px-4 py-2.5 bg-[#fbf2ec] hover:bg-[#f6ece7] text-[#932616] text-xs font-bold rounded-xl flex items-center gap-1.5 border border-[#ffdcc0] shadow-2xs"
            >
              <span className="material-symbols-outlined text-base">radar</span>
              <span>Live Tracking</span>
            </Link>
          </div>
        </div>

        {/* Live Dispatch Stepper */}
        <div className="bg-white rounded-2xl border border-[#E8E2DA] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E8E2DA]">
            <h2 className="font-serif text-lg font-bold text-[#1f1b18] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#932616]">timeline</span>
              Fulfillment & Dispatch Pipeline
            </h2>
            <span className="text-xs font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-2.5 py-0.5 rounded-full">
              Estimated Delivery: Within 24-48 Hours
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-[#fbf2ec] border border-[#ffdcc0] flex flex-col gap-1">
              <div className="w-7 h-7 rounded-full bg-[#005c15] text-white flex items-center justify-center text-xs font-bold">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className="text-xs font-bold text-[#1f1b18] mt-1">1. Order Placed</span>
              <span className="text-[11px] text-[#696159]">{order.createdAt}</span>
            </div>

            <div className={`p-3.5 rounded-xl border flex flex-col gap-1 ${
              order.status === 'Preparing' || order.status === 'Dispatched' || order.status === 'Delivered'
                ? 'bg-[#fbf2ec] border-[#ffdcc0]'
                : 'bg-[#FAF8F5] border-[#E8E2DA] opacity-75'
            }`}>
              <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold ${
                order.status === 'Preparing' ? 'bg-[#ffa03e] animate-pulse' : 'bg-[#005c15]'
              }`}>
                <span className="material-symbols-outlined text-sm">skillet</span>
              </div>
              <span className="text-xs font-bold text-[#1f1b18] mt-1">2. Kitchen Packing</span>
              <span className="text-[11px] text-[#696159]">Nitrogen tamper-proof seal</span>
            </div>

            <div className={`p-3.5 rounded-xl border flex flex-col gap-1 ${
              order.status === 'Dispatched' || order.status === 'Delivered'
                ? 'bg-[#fbf2ec] border-[#ffdcc0]'
                : 'bg-[#FAF8F5] border-[#E8E2DA] opacity-75'
            }`}>
              <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold ${
                order.status === 'Dispatched' ? 'bg-[#932616] animate-pulse' : order.status === 'Delivered' ? 'bg-[#005c15]' : 'bg-[#eae1db] text-[#696159]'
              }`}>
                <span className="material-symbols-outlined text-sm">flight_takeoff</span>
              </div>
              <span className="text-xs font-bold text-[#1f1b18] mt-1">3. Priority Air Transit</span>
              <span className="text-[11px] text-[#696159]">BlueDart Cold-Chain</span>
            </div>

            <div className={`p-3.5 rounded-xl border flex flex-col gap-1 ${
              order.status === 'Delivered'
                ? 'bg-[#fbf2ec] border-[#ffdcc0]'
                : 'bg-[#FAF8F5] border-[#E8E2DA] opacity-75'
            }`}>
              <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold ${
                order.status === 'Delivered' ? 'bg-[#2E7D32]' : 'bg-[#eae1db] text-[#696159]'
              }`}>
                <span className="material-symbols-outlined text-sm">home</span>
              </div>
              <span className="text-xs font-bold text-[#1f1b18] mt-1">4. Handover</span>
              <span className="text-[11px] text-[#696159]">Doorstep OTP Delivery</span>
            </div>
          </div>
        </div>

        {/* Two Columns: Items & Address/Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Items Section (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-[#E8E2DA] p-6 shadow-xs flex flex-col gap-4">
            <h3 className="font-serif text-base font-bold text-[#1f1b18] flex items-center justify-between pb-3 border-b border-[#E8E2DA]">
              <span>Ordered Delicacies</span>
              <span className="text-xs text-[#696159] font-normal">
                {order.items.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </h3>

            <div className="divide-y divide-[#E8E2DA]">
              {order.items.map(item => (
                <div key={item.productId} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#E8E2DA]"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#1f1b18] truncate">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-[#696159] mt-0.5">
                        {item.weight} • Qty: <span className="font-bold text-[#1f1b18]">{item.quantity}</span>
                      </p>
                      <span className="text-[11px] text-[#8d4f00] font-semibold">
                        ₹{item.price} each
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#1f1b18] shrink-0 font-mono">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Summary & Shipping (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-5">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-2xl border border-[#E8E2DA] p-5 shadow-xs flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#8d4f00] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">location_on</span>
                Shipping Destination
              </span>
              <p className="text-xs font-bold text-[#1f1b18]">
                {order.deliveryAddress.recipientName}
              </p>
              <p className="text-xs text-[#58413d]">
                {order.deliveryAddress.street}
              </p>
              <p className="text-xs text-[#58413d]">
                {order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
              </p>
              <p className="text-xs font-semibold text-[#696159] mt-1">
                Contact: {order.deliveryAddress.phone}
              </p>
              {order.deliveryNotes && (
                <div className="mt-2 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2DA] text-[11px] text-[#696159]">
                  <span className="font-bold text-[#1f1b18]">Delivery Notes: </span>
                  "{order.deliveryNotes}"
                </div>
              )}
            </div>

            {/* Price & Payment Breakdown */}
            <div className="bg-white rounded-2xl border border-[#E8E2DA] p-5 shadow-xs flex flex-col gap-3 text-xs">
              <span className="text-[11px] font-bold text-[#8d4f00] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">payments</span>
                Payment Summary
              </span>

              <div className="flex justify-between text-[#696159]">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-[#1f1b18]">₹{order.subtotal.toFixed(2)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-[#005c15] font-semibold">
                  <span>Heritage Discount:</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#696159]">
                <span>Delivery Charge:</span>
                <span className="text-[#005c15] font-bold">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E8E2DA] flex justify-between items-center text-sm font-bold text-[#1f1b18]">
                <span>Total Paid:</span>
                <span className="font-serif text-lg text-[#932616]">
                  ₹{order.total.toFixed(2)}
                </span>
              </div>

              <div className="mt-1 p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E2DA] flex items-center justify-between text-[11px]">
                <span className="text-[#696159]">Payment Method:</span>
                <span className="font-bold text-[#005c15]">{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="flex justify-center pt-4">
          <Link
            to="/"
            className="text-xs font-bold text-[#932616] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Return to Heirloom Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
