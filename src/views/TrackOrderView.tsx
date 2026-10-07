import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const TrackOrderView: React.FC = () => {
  const { orders, selectedOrderNumber, navigate } = useStore();
  const [searchId, setSearchId] = useState(selectedOrderNumber || '#MHF-8821');

  const matchedOrder = orders.find(
    o => o.orderNumber.toLowerCase() === searchId.trim().toLowerCase()
  );

  return (
    <div className="w-full py-10 md:py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8d4f00]">
            Artisan Dispatch Telemetry
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1f1b18] mt-1">
            Track Your Culinary Shipment
          </h1>
          <p className="text-sm text-[#696159] mt-2">
            Real-time cold-chain tracking direct from Tamil Nadu and Andhra kitchens.
          </p>
        </div>

        {/* Search Order Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8E2DA] shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#696159] text-lg">
              receipt_long
            </span>
            <input
              type="text"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder="Enter Order ID (e.g. #MHF-8821)"
              className="w-full h-11 pl-10 pr-4 bg-[#FAF8F5] border border-[#E8E2DA] rounded-xl text-sm font-mono text-[#1f1b18] focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="h-11 px-6 bg-[#932616] hover:bg-[#b43e2b] text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span>Search Status</span>
          </button>
        </div>

        {matchedOrder ? (
          <div className="bg-white rounded-2xl border border-[#E8E2DA] p-6 shadow-sm flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8E2DA]">
              <div>
                <span className="text-xs text-[#696159]">Tracking Order</span>
                <h2 className="font-serif text-2xl font-bold text-[#1f1b18] font-mono">
                  {matchedOrder.orderNumber}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#fbf2ec] text-[#932616] border border-[#ffdcc0]">
                  Status: {matchedOrder.status}
                </span>
                <span className="text-xs font-semibold text-[#005c15] bg-[#a3f69c]/30 px-3 py-1 rounded-full">
                  AWB: {matchedOrder.trackingId}
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`/order/${encodeURIComponent(matchedOrder.orderNumber.replace(/^#/, ''))}`)}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F5] hover:bg-[#eae1db] text-[#1f1b18] border border-[#E8E2DA] cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm text-[#932616]">receipt_long</span>
                  <span>View Details</span>
                </button>
              </div>
            </div>

            {/* Visual Tracking Progress */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2DA]">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#005c15] uppercase tracking-wider">
                    Step 1 · Complete
                  </span>
                  <span className="text-xs font-bold text-[#1f1b18]">Order Booked</span>
                  <span className="text-[11px] text-[#696159]">{matchedOrder.createdAt}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#005c15] uppercase tracking-wider">
                    Step 2 · In Kitchen
                  </span>
                  <span className="text-xs font-bold text-[#1f1b18]">Handcrafted & Sealed</span>
                  <span className="text-[11px] text-[#696159]">Pure A2 Ghee Packing</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#8d4f00] uppercase tracking-wider">
                    Step 3 · Transit
                  </span>
                  <span className="text-xs font-bold text-[#1f1b18]">BlueDart Cold-Chain</span>
                  <span className="text-[11px] text-[#696159]">Air Express Dispatched</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#696159] uppercase tracking-wider">
                    Step 4 · Handover
                  </span>
                  <span className="text-xs font-bold text-[#1f1b18]">Final Door Delivery</span>
                  <span className="text-[11px] text-[#696159]">Expected Tomorrow 2 PM</span>
                </div>
              </div>
            </div>

            {/* Recipient info */}
            <div className="text-xs text-[#58413d] flex flex-col gap-1 p-3.5 bg-white border border-[#E8E2DA] rounded-xl">
              <span className="font-bold text-[#1f1b18]">Shipping Destination:</span>
              <span>
                {matchedOrder.deliveryAddress.recipientName} ({matchedOrder.deliveryAddress.phone})
              </span>
              <span>
                {matchedOrder.deliveryAddress.street}, {matchedOrder.deliveryAddress.city},{' '}
                {matchedOrder.deliveryAddress.state} — {matchedOrder.deliveryAddress.pincode}
              </span>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#696159]">
                Delicacies In Parcel ({matchedOrder.items.length})
              </span>
              <div className="divide-y divide-[#E8E2DA]">
                {matchedOrder.items.map(item => (
                  <div key={item.productId} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#1f1b18]">{item.productName}</p>
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
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-[#E8E2DA] p-6">
            <span className="material-symbols-outlined text-4xl text-[#696159]">search_off</span>
            <p className="text-sm font-bold text-[#1f1b18] mt-2">No matching order found</p>
            <p className="text-xs text-[#696159] mt-1">
              Please check your Order ID format (e.g. #MHF-8821 or #MHF-8820).
            </p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('home')}
            className="text-xs font-bold text-[#932616] hover:underline"
          >
            ← Return to Heirloom Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
