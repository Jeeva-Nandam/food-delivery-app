import React from 'react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessView: React.FC = () => {
  const { latestPlacedOrder, orders, navigate, navigateAdmin } = useStore();

  const order = latestPlacedOrder || orders[0];

  return (
    <div className="w-full py-10 md:py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {/* Success Card Header */}
        <div className="bg-white rounded-2xl border border-[#E8E2DA] p-6 sm:p-10 text-center shadow-lg relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center mx-auto mb-4">
            <span
              className="material-symbols-outlined text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#8d4f00]">
            Payment Received & Verified
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1f1b18] mt-1">
            Order Confirmed!
          </h1>
          <p className="text-sm text-[#696159] mt-2 max-w-md mx-auto">
            Thank you, <span className="font-bold text-[#1f1b18]">{order?.customerName}</span>.
            Your authentic heritage batch has been transmitted to our native confectioners.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA]">
            <div className="flex items-center gap-1.5 px-3 py-1">
              <span className="text-xs text-[#696159]">Order ID:</span>
              <span className="text-sm font-bold text-[#932616] font-mono">
                {order?.orderNumber}
              </span>
            </div>
            <span className="text-[#E8E2DA] hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 px-3 py-1">
              <span className="text-xs text-[#696159]">Amount Paid:</span>
              <span className="text-sm font-bold text-[#1f1b18]">
                ₹{order?.total.toFixed(2)}
              </span>
            </div>
            <span className="text-[#E8E2DA] hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5 px-3 py-1">
              <span className="text-xs text-[#696159]">Tracking:</span>
              <span className="text-xs font-bold text-[#005c15]">
                {order?.trackingId || 'BD-AIR-88214'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Fulfillment Stepper */}
        <div className="bg-white rounded-2xl border border-[#E8E2DA] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E8E2DA]">
            <h2 className="font-serif text-lg font-bold text-[#1f1b18] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#932616]">local_shipping</span>
              Live Dispatch Pipeline
            </h2>
            <span className="text-xs font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-2.5 py-1 rounded-full">
              Estimated: Tomorrow by 2:00 PM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#fbf2ec] border border-[#ffdcc0]">
              <div className="w-8 h-8 rounded-full bg-[#005c15] text-white flex items-center justify-center text-sm font-bold">
                <span className="material-symbols-outlined text-base">check</span>
              </div>
              <span className="text-xs font-bold text-[#1f1b18]">1. Order Confirmed</span>
              <span className="text-[11px] text-[#696159]">Verified via RBI gateway</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#932616]">
              <div className="w-8 h-8 rounded-full bg-[#932616] text-white flex items-center justify-center text-sm font-bold animate-pulse">
                <span className="material-symbols-outlined text-base">skillet</span>
              </div>
              <span className="text-xs font-bold text-[#932616]">2. Kitchen Packing</span>
              <span className="text-[11px] text-[#696159]">Tamper-proof nitrogen seal</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] opacity-75">
              <div className="w-8 h-8 rounded-full bg-[#eae1db] text-[#696159] flex items-center justify-center text-sm font-bold">
                <span className="material-symbols-outlined text-base">flight_takeoff</span>
              </div>
              <span className="text-xs font-bold text-[#1f1b18]">3. Express Air Transit</span>
              <span className="text-[11px] text-[#696159]">BlueDart Priority Cold-Chain</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] opacity-75">
              <div className="w-8 h-8 rounded-full bg-[#eae1db] text-[#696159] flex items-center justify-center text-sm font-bold">
                <span className="material-symbols-outlined text-base">home</span>
              </div>
              <span className="text-xs font-bold text-[#1f1b18]">4. Doorstep Handover</span>
              <span className="text-[11px] text-[#696159]">OTP verification at delivery</span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-2xl border border-[#E8E2DA] p-6 shadow-xs flex flex-col gap-5">
          <h3 className="font-serif text-lg font-bold text-[#1f1b18]">
            Order Receipt & Delivery Summary
          </h3>

          {/* Delivery Address Details */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] flex flex-col gap-1">
            <span className="text-xs font-bold text-[#8d4f00] uppercase tracking-wider">
              Delivering To:
            </span>
            <p className="text-sm font-bold text-[#1f1b18]">
              {order?.deliveryAddress.recipientName} ({order?.deliveryAddress.phone})
            </p>
            <p className="text-xs text-[#58413d]">
              {order?.deliveryAddress.street}, {order?.deliveryAddress.city},{' '}
              {order?.deliveryAddress.state} — {order?.deliveryAddress.pincode}
            </p>
            {order?.deliveryNotes && (
              <p className="text-[11px] text-[#696159] italic mt-1">
                Note: "{order.deliveryNotes}"
              </p>
            )}
          </div>

          {/* Items Table */}
          <div className="divide-y divide-[#E8E2DA]">
            {order?.items.map(item => (
              <div key={item.productId} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#1f1b18]">{item.productName}</h4>
                    <span className="text-[11px] text-[#696159]">
                      {item.weight} • Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1f1b18]">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8E2DA] flex items-center justify-between text-base font-bold text-[#1f1b18]">
            <span>Total Paid ({order?.paymentMethod}):</span>
            <span className="text-[#932616] font-serif text-xl">
              ₹{order?.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white border border-[#E8E2DA] hover:bg-[#FAF8F5] text-xs font-bold text-[#1f1b18] rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Print Tax Invoice</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('track-order', { orderNumber: order?.orderNumber })}
              className="px-4 py-2.5 bg-[#fbf2ec] border border-[#ffdcc0] text-xs font-bold text-[#8d4f00] rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-base">radar</span>
              <span>Track Live Package</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="px-5 py-2.5 bg-[#932616] text-white hover:bg-[#b43e2b] text-xs font-bold rounded-xl cursor-pointer shadow"
            >
              Continue Shopping
            </button>

            <button
              type="button"
              onClick={() => navigateAdmin('orders')}
              className="px-4 py-2.5 bg-[#342f2c] text-white hover:bg-[#1f1b18] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#D49B24]">store</span>
              <span>View in Admin Stream</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
