import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInspectOrder, setActiveInspectOrder] = useState<Order | null>(null);

  const statuses: string[] = ['All', 'New', 'Preparing', 'Dispatched', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(ord => {
    const matchStatus = selectedStatus === 'All' || ord.status === selectedStatus;
    const matchSearch =
      !searchQuery ||
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  return (
    <div className="px-4 sm:px-8 py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4f00]">
            Kitchen & Fulfillment Stream
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f1b18]">
            Orders Registry ({orders.length})
          </h1>
          <p className="text-xs text-[#696159]">
            Real-time status updates and delivery tracking for native artisanal shipments.
          </p>
        </div>

        {/* Quick summary counts */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-[#932616] text-white text-xs font-bold">
            {orders.filter(o => o.status === 'New').length} New
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#ffa03e] text-[#1f1b18] text-xs font-bold">
            {orders.filter(o => o.status === 'Preparing').length} Preparing
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#2E7D32]/20 text-[#2E7D32] text-xs font-bold">
            {orders.filter(o => o.status === 'Dispatched').length} In Transit
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E8E2DA] flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#696159] text-base">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, name, or phone..."
            className="w-full h-9 pl-9 pr-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg text-xs text-[#1f1b18] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'bg-[#932616] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#58413d] hover:bg-[#eae1db]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E8E2DA] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#fbf2ec] text-[#696159] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Items Ordered</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Update Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2DA]">
              {filteredOrders.map(ord => (
                <tr key={ord.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#1f1b18]">{ord.orderNumber}</span>
                      {ord.status === 'New' && (
                        <span className="w-2 h-2 rounded-full bg-[#932616] animate-pulse"></span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#696159]">{ord.createdAt}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-bold text-[#1f1b18] block">{ord.customerName}</span>
                    <span className="text-[11px] text-[#696159]">{ord.customerPhone}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-[#1f1b18]">
                      {ord.items.reduce((s, i) => s + i.quantity, 0)} Items
                    </span>
                    <span className="text-[11px] text-[#696159] truncate max-w-[130px] block">
                      {ord.items.map(i => i.productName).join(', ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-bold text-[#1f1b18]">₹{ord.total.toFixed(2)}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#a3f69c]/30 text-[#005c15]">
                      {ord.paymentMethod}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === 'New'
                          ? 'bg-[#932616] text-white'
                          : ord.status === 'Preparing'
                          ? 'bg-[#ffa03e] text-[#1f1b18]'
                          : ord.status === 'Dispatched'
                          ? 'bg-[#eae1db] text-[#58413d]'
                          : ord.status === 'Delivered'
                          ? 'bg-[#2E7D32]/15 text-[#2E7D32]'
                          : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>

                  {/* Inline Status Changer */}
                  <td className="py-3.5 px-3">
                    <select
                      value={ord.status}
                      onChange={e => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="bg-[#FAF8F5] border border-[#E8E2DA] rounded px-2 py-1 text-xs font-semibold text-[#1f1b18] cursor-pointer"
                    >
                      <option value="New">Mark New</option>
                      <option value="Preparing">Mark Preparing</option>
                      <option value="Dispatched">Mark Dispatched</option>
                      <option value="Delivered">Mark Delivered</option>
                      <option value="Cancelled">Cancel Order</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setActiveInspectOrder(ord)}
                      className="px-2.5 py-1 bg-[#fbf2ec] hover:bg-[#eae1db] text-[#932616] font-bold rounded-lg text-xs cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Modal */}
      {activeInspectOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2DA]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2DA]">
              <h3 className="font-serif text-lg font-bold text-[#1f1b18]">
                Order {activeInspectOrder.orderNumber}
              </h3>
              <button onClick={() => setActiveInspectOrder(null)}>
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2DA]">
                <p className="font-bold text-[#1f1b18]">{activeInspectOrder.customerName}</p>
                <p className="text-[#696159]">{activeInspectOrder.customerEmail} • {activeInspectOrder.customerPhone}</p>
                <p className="text-[#58413d] mt-1">
                  {activeInspectOrder.deliveryAddress.street}, {activeInspectOrder.deliveryAddress.city}, {activeInspectOrder.deliveryAddress.state} - {activeInspectOrder.deliveryAddress.pincode}
                </p>
                {activeInspectOrder.deliveryNotes && (
                  <p className="text-[11px] text-[#8d4f00] italic mt-1">Instructions: "{activeInspectOrder.deliveryNotes}"</p>
                )}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#1f1b18] uppercase text-[11px]">Items:</span>
                {activeInspectOrder.items.map(i => (
                  <div key={i.productId} className="flex justify-between items-center py-1 border-b border-[#E8E2DA]/60">
                    <span>{i.productName} ({i.weight} × {i.quantity})</span>
                    <span className="font-bold">₹{i.price * i.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-[#E8E2DA]">
                <span>Total Amount:</span>
                <span className="text-[#932616] font-serif text-base">₹{activeInspectOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2DA]">
              <button
                onClick={() => setActiveInspectOrder(null)}
                className="px-4 py-2 bg-slate-100 rounded-lg font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
