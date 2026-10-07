import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    isAcceptingOrders,
    toggleAcceptingOrders,
    navigateAdmin,
  } = useStore();

  const [timeFilter, setTimeFilter] = useState<'Today' | 'Last 7 Days' | 'This Month' | 'Custom'>('Today');
  const [orderStreamFilter, setOrderStreamFilter] = useState<'All' | 'Needs Dispatch' | 'GI Direct'>('All');
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);
  const [labelModalOrder, setLabelModalOrder] = useState<Order | null>(null);

  // Filter orders for the stream
  const filteredOrders = orders.filter(ord => {
    if (orderStreamFilter === 'Needs Dispatch') {
      return ord.status === 'New' || ord.status === 'Preparing';
    }
    if (orderStreamFilter === 'GI Direct') {
      return ord.isGIDirect;
    }
    return true;
  });

  return (
    <div className="px-4 sm:px-8 py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Editorial Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-[#696159]">
            <span className="font-bold uppercase tracking-wider text-[#8d4f00]">Operational Hub</span>
            <span className="text-[#eae1db]">/</span>
            <span>Live Fulfillment Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1f1b18] font-bold tracking-tight mt-0.5">
            Store Overview & Real-time Operations
          </h1>
          <p className="text-xs sm:text-sm text-[#696159]">
            Direct telemetry from Madurai, Tirunelveli & Guntur artisanal production batches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Filter Pills */}
          <div className="inline-flex p-1 bg-[#fbf2ec] rounded-xl shadow-2xs border border-[#E8E2DA]">
            {(['Today', 'Last 7 Days', 'This Month', 'Custom'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setTimeFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeFilter === tab
                    ? 'bg-white text-[#932616] shadow-xs'
                    : 'text-[#696159] hover:text-[#1f1b18]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,Order ID,Customer,Total,Status\n' +
                orders.map(o => `${o.orderNumber},"${o.customerName}",${o.total},${o.status}`).join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `miras_orders_report_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="h-9 px-3.5 rounded-lg bg-white hover:bg-[#fbf2ec] text-[#1f1b18] border border-[#E8E2DA] text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#696159]">file_download</span>
            <span>Export Report</span>
          </button>

          {/* Store Accepting Orders Toggle */}
          <div className="h-9 px-3 rounded-lg bg-[#fbf2ec] border border-[#E8E2DA] flex items-center gap-2.5 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                {isAcceptingOrders && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isAcceptingOrders ? 'bg-[#2E7D32]' : 'bg-[#ba1a1a]'
                  }`}
                ></span>
              </span>
              <span className="text-xs text-[#1f1b18] font-bold tracking-tight">
                {isAcceptingOrders ? 'Accepting Orders' : 'Store Paused'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAcceptingOrders}
                onChange={toggleAcceptingOrders}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-[#eae1db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#2E7D32]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 6 Key Operations Metric Cards (Exact match to Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#696159]">Today's Revenue</span>
            <span className="w-7 h-7 rounded-lg bg-[#932616]/10 text-[#932616] flex items-center justify-center">
              <span className="material-symbols-outlined text-base">currency_rupee</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="font-serif text-2xl text-[#1f1b18] font-bold">₹48,250</div>
            <div className="flex items-center gap-1 mt-0.5 text-[#2E7D32] text-xs font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+14.2%</span>
              <span className="text-[#696159] font-normal text-[10px]">vs yesterday</span>
            </div>
          </div>
          <div className="mt-2 pt-1">
            <svg className="w-full h-6 text-[#932616]/70 overflow-visible" fill="none" viewBox="0 0 100 24">
              <path d="M0 18 Q 15 22, 28 14 T 55 9 T 80 12 T 100 3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
              <path d="M0 18 Q 15 22, 28 14 T 55 9 T 80 12 T 100 3 L 100 24 L 0 24 Z" fill="currentColor" fillOpacity="0.08"></path>
            </svg>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#696159]">Orders Received</span>
            <span className="w-7 h-7 rounded-lg bg-[#ffdcc0] text-[#8d4f00] flex items-center justify-center">
              <span className="material-symbols-outlined text-base">shopping_bag</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="font-serif text-2xl text-[#1f1b18] font-bold">68 Orders</div>
            <div className="flex items-center gap-1.5 mt-0.5 text-[#8d4f00] text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8d4f00]"></span>
              <span>12 pending packing</span>
            </div>
          </div>
          <div className="mt-2 pt-1 flex items-center justify-between text-[#696159] text-[11px]">
            <span>Processed: 56</span>
            <span className="text-[#2E7D32] font-semibold">82% cleared</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#696159]">Avg Order Value</span>
            <span className="w-7 h-7 rounded-lg bg-[#eae1db] text-[#58413d] flex items-center justify-center">
              <span className="material-symbols-outlined text-base">receipt</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="font-serif text-2xl text-[#1f1b18] font-bold">₹710</div>
            <div className="flex items-center gap-1 mt-0.5 text-[#2E7D32] text-xs font-bold">
              <span className="material-symbols-outlined text-sm">arrow_upward</span>
              <span>+5.8%</span>
              <span className="text-[#696159] font-normal text-[10px]">basket depth</span>
            </div>
          </div>
          <div className="mt-2 pt-1 flex items-center gap-1 text-[#696159] text-[11px]">
            <span className="font-bold text-[#1f1b18]">3.4 items</span>
            <span>avg / order</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#696159]">Active Customers</span>
            <span className="w-7 h-7 rounded-lg bg-[#f6ece7] text-[#932616] flex items-center justify-center">
              <span className="material-symbols-outlined text-base">group</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="font-serif text-2xl text-[#1f1b18] font-bold">1,420</div>
            <div className="flex items-center gap-1 mt-0.5 text-[#932616] text-xs font-bold">
              <span className="material-symbols-outlined text-sm">person_add</span>
              <span>38 new accounts</span>
            </div>
          </div>
          <div className="mt-2 pt-1 flex items-center justify-between text-[#696159] text-[11px]">
            <span>Repeat rate</span>
            <span className="text-[#1f1b18] font-bold">41.8%</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#696159]">Low Stock Alerts</span>
            <span className="w-7 h-7 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-base">warning</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="font-serif text-2xl text-[#ba1a1a] font-bold">4 SKUs</div>
            <div className="flex items-center gap-1 mt-0.5 text-[#ba1a1a] text-xs font-bold">
              <span className="material-symbols-outlined text-xs">fmd_bad</span>
              <span>Tirunelveli cluster</span>
            </div>
          </div>
          <div className="mt-2 pt-1 text-[#696159] text-[11px]">
            <span>Replenishment scheduled</span>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#696159]">Dispatch SLA Met</span>
            <span className="w-7 h-7 rounded-lg bg-[#a3f69c]/30 text-[#005c15] flex items-center justify-center">
              <span className="material-symbols-outlined text-base">verified</span>
            </span>
          </div>
          <div className="mt-2">
            <div className="font-serif text-2xl text-[#005c15] font-bold">99.4%</div>
            <div className="flex items-center gap-1 mt-0.5 text-[#005c15] text-xs font-bold">
              <span className="material-symbols-outlined text-sm">local_shipping</span>
              <span>&lt; 24h turn-around</span>
            </div>
          </div>
          <div className="mt-2 pt-1 flex items-center justify-between text-[#696159] text-[11px]">
            <span>Delays: 0 items</span>
            <span className="text-[#005c15] font-bold">Flawless</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Charts & Orders (8 Cols) vs Right Clusters & Rankings (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Category Sales Volume & Trajectory Chart Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#932616]"></span>
                  <h2 className="font-serif text-lg font-bold text-[#1f1b18]">
                    Category Sales Volume & Fulfillment Trajectory
                  </h2>
                </div>
                <p className="text-xs text-[#696159] mt-0.5">
                  Aggregated hourly volume comparing traditional confections vs organic pantry lines.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] font-bold flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#932616]"></span>
                  <span>Sweets & Halwa</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#ffa03e]"></span>
                  <span>Savouries</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#D49B24]"></span>
                  <span>Pickles & Podis</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#2E7D32]"></span>
                  <span>Millets</span>
                </div>
              </div>
            </div>

            {/* Interactive Day Columns Chart */}
            <div className="w-full h-64 pt-4 flex flex-col justify-end">
              <div className="grid grid-cols-7 h-52 w-full items-end gap-2 sm:gap-5 px-2">
                {[
                  { day: 'Mon', h1: '48%', h2: '32%', h3: '20%', h4: '15%' },
                  { day: 'Tue', h1: '60%', h2: '42%', h3: '25%', h4: '22%' },
                  { day: 'Wed', h1: '52%', h2: '38%', h3: '30%', h4: '18%' },
                  { day: 'Thu', h1: '72%', h2: '55%', h3: '40%', h4: '28%' },
                  { day: 'Fri', h1: '85%', h2: '68%', h3: '48%', h4: '35%' },
                  { day: 'Sat', h1: '94%', h2: '78%', h3: '62%', h4: '44%', isPeak: true },
                  { day: 'Today', h1: '78%', h2: '62%', h3: '52%', h4: '38%' },
                ].map((col, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end relative group">
                    {col.isPeak && (
                      <div className="absolute -top-7 bg-[#342f2c] text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-md whitespace-nowrap">
                        ₹58,400 Peak
                      </div>
                    )}
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <div className="w-2.5 sm:w-3.5 bg-[#932616] rounded-t transition-all group-hover:brightness-110" style={{ height: col.h1 }}></div>
                      <div className="w-2.5 sm:w-3.5 bg-[#ffa03e] rounded-t transition-all group-hover:brightness-110" style={{ height: col.h2 }}></div>
                      <div className="w-2.5 sm:w-3.5 bg-[#D49B24] rounded-t transition-all group-hover:brightness-110" style={{ height: col.h3 }}></div>
                      <div className="w-2.5 sm:w-3.5 bg-[#2E7D32] rounded-t transition-all group-hover:brightness-110" style={{ height: col.h4 }}></div>
                    </div>
                    <span className={`text-[11px] ${col.isPeak ? 'font-bold text-[#932616]' : 'text-[#696159]'}`}>
                      {col.day}
                    </span>
                  </div>
                ))}
              </div>
              <div className="w-full bg-[#f0e6e1] h-px mt-2"></div>
            </div>

            {/* Trajectory Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-[#fbf2ec] flex flex-col border border-[#ffdcc0]">
                <span className="text-[10px] font-bold text-[#696159] uppercase">Sweets Top Grosser</span>
                <span className="text-xs font-bold text-[#1f1b18] mt-0.5">Tirunelveli Halwa</span>
                <span className="text-[11px] text-[#932616] font-bold">₹18,400 (38% vol)</span>
              </div>
              <div className="p-3 rounded-lg bg-[#fbf2ec] flex flex-col border border-[#ffdcc0]">
                <span className="text-[10px] font-bold text-[#696159] uppercase">Savouries Peak</span>
                <span className="text-xs font-bold text-[#1f1b18] mt-0.5">Madurai Kari Murukku</span>
                <span className="text-[11px] text-[#8d4f00] font-bold">₹14,200 (29% vol)</span>
              </div>
              <div className="p-3 rounded-lg bg-[#fbf2ec] flex flex-col border border-[#ffdcc0]">
                <span className="text-[10px] font-bold text-[#696159] uppercase">Fastest Velocity</span>
                <span className="text-xs font-bold text-[#1f1b18] mt-0.5">Avakaya Pickle Jar</span>
                <span className="text-[11px] text-[#D49B24] font-bold">₹9,850 (20% vol)</span>
              </div>
              <div className="p-3 rounded-lg bg-[#fbf2ec] flex flex-col border border-[#ffdcc0]">
                <span className="text-[10px] font-bold text-[#696159] uppercase">Organic Millets</span>
                <span className="text-xs font-bold text-[#1f1b18] mt-0.5">Kodo Millet Laddoo</span>
                <span className="text-[11px] text-[#2E7D32] font-bold">₹5,800 (13% vol)</span>
              </div>
            </div>
          </div>

          {/* Live Orders Stream Table Card (Exact match to Image 3) */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#932616] text-xl">local_mall</span>
                  <h2 className="font-serif text-lg font-bold text-[#1f1b18]">Live Orders Stream</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#932616]/10 text-[#932616] text-[11px] font-bold">
                    {orders.length} Live
                  </span>
                </div>
                <p className="text-xs text-[#696159] mt-0.5">
                  Real-time gateway syncing express orders for kitchen dispatch.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1">
                {(['All', 'Needs Dispatch', 'GI Direct'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setOrderStreamFilter(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      orderStreamFilter === tab
                        ? 'bg-[#b43e2b] text-white shadow-xs'
                        : 'bg-[#fbf2ec] text-[#1f1b18] hover:bg-[#f6ece7]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#fbf2ec] text-[#696159] font-bold uppercase tracking-wider">
                    <th className="py-3 px-3 rounded-l-lg">Order ID</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Items</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Fulfillment</th>
                    <th className="py-3 px-3 rounded-r-lg text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2DA]">
                  {filteredOrders.slice(0, 5).map(ord => {
                    const statusColors: Record<OrderStatus, string> = {
                      New: 'bg-[#932616] text-white',
                      Preparing: 'bg-[#ffa03e] text-[#1f1b18]',
                      Dispatched: 'bg-[#eae1db] text-[#58413d]',
                      Delivered: 'bg-[#2E7D32]/15 text-[#2E7D32]',
                      Cancelled: 'bg-[#ffdad6] text-[#ba1a1a]',
                    };

                    return (
                      <tr key={ord.id} className="hover:bg-[#fbf2ec]/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[#1f1b18]">{ord.orderNumber}</span>
                            {ord.status === 'New' && (
                              <span className="w-2 h-2 rounded-full bg-[#932616] animate-pulse"></span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#696159]">{ord.createdAt}</span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-bold text-[#1f1b18]">{ord.customerName}</div>
                          <span className="text-[11px] text-[#696159]">
                            {ord.deliveryAddress.city}, {ord.deliveryAddress.state.slice(0, 3).toUpperCase()}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-semibold text-[#1f1b18]">
                            {ord.items.reduce((s, i) => s + i.quantity, 0)} Items
                          </div>
                          <span className="text-[11px] text-[#696159] truncate max-w-[120px] block">
                            {ord.items.map(i => i.productName.split(' ')[0]).join(', ')}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-bold text-[#1f1b18]">
                          ₹{ord.total.toFixed(2)}
                        </td>

                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#a3f69c]/30 text-[#005c15]">
                            {ord.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              statusColors[ord.status] || 'bg-slate-100'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => setInspectOrder(ord)}
                              title="Inspect Order Details"
                              className="w-7 h-7 rounded-lg bg-[#fbf2ec] hover:bg-[#eae1db] flex items-center justify-center text-[#1f1b18] cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-base">visibility</span>
                            </button>
                            <button
                              onClick={() => setLabelModalOrder(ord)}
                              title="Print Shipping Label"
                              className="w-7 h-7 rounded-lg bg-[#fbf2ec] hover:bg-[#eae1db] flex items-center justify-center text-[#932616] cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-base">print</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2 text-[#696159] text-xs">
              <span>Showing {Math.min(5, filteredOrders.length)} of {orders.length} orders captured today</span>
              <button
                onClick={() => navigateAdmin('orders')}
                className="inline-flex items-center gap-1 text-[#932616] font-bold hover:underline cursor-pointer"
              >
                <span>View all orders registry</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Cluster Inventory Health Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8d4f00] text-xl">warehouse</span>
                <h3 className="font-serif text-base font-bold text-[#1f1b18]">Cluster Inventory Health</h3>
              </div>
              <span className="text-[11px] text-[#696159]">Batch Freshness</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-lg bg-[#fbf2ec] flex flex-col gap-1.5 border border-[#E8E2DA]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1f1b18]">Tirunelveli Wheat Halwa</span>
                  <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold">
                    18 units left
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#696159]">
                  <span>Air-sealed 500g brass-tin</span>
                  <span className="text-[#ba1a1a] font-bold">Low Stock Alert</span>
                </div>
                <div className="w-full bg-[#eae1db] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#ba1a1a] h-1.5 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#fbf2ec] flex flex-col gap-1.5 border border-[#E8E2DA]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1f1b18]">Madurai Kari Murukku</span>
                  <span className="px-2 py-0.5 rounded bg-[#ba1a1a] text-white text-[10px] font-bold">
                    8 units left
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#696159]">
                  <span>250g Artisanal foil pack</span>
                  <span className="text-[#ba1a1a] font-bold">Critical Reorder</span>
                </div>
                <div className="w-full bg-[#eae1db] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#ba1a1a] h-1.5 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#fbf2ec] flex flex-col gap-1.5 border border-[#E8E2DA]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1f1b18]">Guntur Gongura Pickle</span>
                  <span className="px-2 py-0.5 rounded bg-[#2E7D32]/15 text-[#2E7D32] text-[10px] font-bold">
                    142 units
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#696159]">
                  <span>300g Ceramic-look jar</span>
                  <span className="text-[#2E7D32] font-bold">Healthy Reserve</span>
                </div>
                <div className="w-full bg-[#eae1db] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#2E7D32] h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-[#696159]">
              <span>Next batch arrival: Today 4:30 PM</span>
              <button
                onClick={() => navigateAdmin('inventory')}
                className="text-[#932616] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Manage Batch Inventory</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
          </div>

          {/* Top Delicacies List */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#D49B24] text-xl">award_star</span>
                <h3 className="font-serif text-base font-bold text-[#1f1b18]">Top Delicacies</h3>
              </div>
              <span className="text-[11px] text-[#696159]">This Week</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                {
                  name: 'GI Tirunelveli Halwa',
                  revenue: '₹1,18,500',
                  volume: '342 kg dispatched',
                  growth: '+22%',
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3kI2sWKEVtESP8ouCvMkACRksd7qIeCt7y7c68UwN1-mAxOZTIQt8706F7aoqDvB0YcG6dFh1Zg0Q-nC0iePIpl9o8lkQ8VxVTE95Xtk6d2Kdss-ue40DRekdGvtgQfdz4-5y56tFP2OFt3omKh4bI0h_fuEwEIwsz57hI1zs3ZklGB-vHep9xThAO1ewC0eD2GXPV7IHNvrYzrgQYSQ1Yxo8NpFsKqjc3oaA7KeWkmsPjx6dNuFB',
                },
                {
                  name: 'Madurai Spiced Murukku',
                  revenue: '₹82,400',
                  volume: '510 packs',
                  growth: '+18%',
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKRRE1QTZkJu0u2QU5rzEt1UqY6SDQvyAIz7EKOhaP7XUiumrIyPLLXVl955QbLV73QcR_pWEnyo7ew8ozSd5i0UJDRuBgjUxqWRNMG_w955Lbt0xhHCyGzvIRhZf9Kdsr0iZxdhG0bWuqQQjlkEvLydmUbVhIzCyVtqom5hlZA84A9wm0wxnqn7-vmPpTCpNbCrKPUxBAdjtavOcAtHokWGvW59qVNnUG3JTSyQKl8T5BqkzlEfsQ',
                },
                {
                  name: 'Guntur Red Sorrel Tokku',
                  revenue: '₹64,120',
                  volume: '288 jars',
                  growth: '+9%',
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSajttjPuPybeB2BuVa2vN1rOeE2xh340vmL8CAPKTETL_WReB4LfUhE_XRSNHMimNP4Emhr3R_QdF106v5DV29ny7JdI8iLKvtz1DSIFangx90SPvKS501LvPRs1E0rvIDEXKvfnO1iyYSdFJpgx-m7eW8NF1T03b4r8EaFD5vXYJnJTVQDnGeBiQ9_seBBTwA9nu54CcTngXivNDbirnztmAF6ExWsIGzqAcGaRsZCNBh20xortB',
                },
                {
                  name: 'Kodo Millet Ghee Laddoo',
                  revenue: '₹44,300',
                  volume: '195 boxes',
                  growth: '+14%',
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-99-y1viYTFlkz6u-Wm-plyN7bUJGS1HCCPoQdg3HgrMcfWzUVOrc-vvhLK4AzsH5uZXD6DUUTjiHxazp2NgdmggwMCpRBnOQohnfyOvjhxlyBNRGrab7r84PQ_C4YOEs9Op_ljUJb_VxbcSHNiLYTP2CkD7MN2Kif12nqQ7kb4UyoLISifA_uPr_HZzuO1D2FUwarB8Wlxx6gO841anzjug8soDf_3ZoS2fBu03iHBtpGHnI2xKo',
                },
              ].map(item => (
                <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#fbf2ec] transition-colors">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#1f1b18] truncate">{item.name}</h4>
                      <span className="text-xs font-bold text-[#1f1b18]">{item.revenue}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#696159] mt-0.5">
                      <span>{item.volume}</span>
                      <span className="text-[#2E7D32] font-bold">{item.growth}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Deliveries */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#932616] text-xl">map</span>
                <h3 className="font-serif text-base font-bold text-[#1f1b18]">Regional Deliveries</h3>
              </div>
              <span className="text-[10px] font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-2 py-0.5 rounded">
                Active Hubs
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { region: 'Tamil Nadu (Hub Origin)', pct: '48%', orders: '33 Orders', color: 'bg-[#932616]' },
                { region: 'Karnataka (Bengaluru Express)', pct: '26%', orders: '18 Orders', color: 'bg-[#ffa03e]' },
                { region: 'Andhra & Telangana', pct: '16%', orders: '11 Orders', color: 'bg-[#D49B24]' },
                { region: 'Rest of India (Air Express)', pct: '10%', orders: '6 Orders', color: 'bg-[#25752b]' },
              ].map(r => (
                <div key={r.region}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#1f1b18] font-semibold">{r.region}</span>
                    <span className="text-[#696159]">{r.pct} ({r.orders})</span>
                  </div>
                  <div className="w-full bg-[#eae1db] rounded-full h-1.5 mt-1 overflow-hidden">
                    <div className={`${r.color} h-1.5 rounded-full`} style={{ width: r.pct }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-lg bg-[#fbf2ec] flex items-center gap-2 text-xs text-[#1f1b18] border border-[#E8E2DA]">
              <span className="material-symbols-outlined text-base text-[#005c15]">flight_takeoff</span>
              <span className="text-[11px]">BlueDart Priority Air active for Delhi NCR & Mumbai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inspect Order Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E8E2DA] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2DA]">
              <div>
                <span className="text-xs text-[#696159]">Order Inspector</span>
                <h3 className="font-serif text-xl font-bold text-[#1f1b18] font-mono">
                  {inspectOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setInspectOrder(null)} className="text-[#696159] hover:text-[#1f1b18]">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="flex items-center justify-between bg-[#fbf2ec] p-3 rounded-lg">
                <div>
                  <span className="font-bold text-[#1f1b18]">Current Status:</span>
                  <span className="ml-2 px-2 py-0.5 rounded font-bold bg-[#932616] text-white">
                    {inspectOrder.status}
                  </span>
                </div>
                {/* Status Switcher */}
                <select
                  value={inspectOrder.status}
                  onChange={e => {
                    const newStatus = e.target.value as OrderStatus;
                    updateOrderStatus(inspectOrder.id, newStatus);
                    setInspectOrder({ ...inspectOrder, status: newStatus });
                  }}
                  className="bg-white border border-[#E8E2DA] rounded px-2 py-1 font-semibold text-xs"
                >
                  <option value="New">New</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <h4 className="font-bold text-[#1f1b18] uppercase text-[11px]">Customer & Destination:</h4>
                <p className="font-semibold text-[#1f1b18]">{inspectOrder.customerName} ({inspectOrder.customerPhone})</p>
                <p className="text-[#696159]">{inspectOrder.deliveryAddress.street}, {inspectOrder.deliveryAddress.city}, {inspectOrder.deliveryAddress.state} - {inspectOrder.deliveryAddress.pincode}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#1f1b18] uppercase text-[11px]">Ordered Items:</h4>
                <div className="divide-y divide-[#E8E2DA] border border-[#E8E2DA] rounded-lg p-2">
                  {inspectOrder.items.map(item => (
                    <div key={item.productId} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt={item.productName} className="w-8 h-8 rounded object-cover" />
                        <div>
                          <p className="font-bold text-[#1f1b18]">{item.productName}</p>
                          <span className="text-[11px] text-[#696159]">{item.weight} × {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#1f1b18]">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-[#E8E2DA]">
                <span>Total Amount:</span>
                <span className="text-[#932616] font-serif text-lg">₹{inspectOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2DA]">
              <button
                onClick={() => setInspectOrder(null)}
                className="px-4 py-2 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Label Modal */}
      {labelModalOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-dashed border-[#1f1b18]">
            <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-3">
              <div>
                <h2 className="font-bold text-base">BLUEDART EXPRESS AIR</h2>
                <p className="text-[10px] font-mono font-bold">AWB: {labelModalOrder.trackingId}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold bg-black text-white px-2 py-0.5">COLD-CHAIN</span>
                <p className="text-[10px] mt-1">PRIORITY 24H</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="border border-black p-2">
                <p className="text-[10px] font-bold">SHIP TO:</p>
                <p className="font-bold text-sm">{labelModalOrder.deliveryAddress.recipientName}</p>
                <p>{labelModalOrder.deliveryAddress.street}</p>
                <p>{labelModalOrder.deliveryAddress.city}, {labelModalOrder.deliveryAddress.state} - {labelModalOrder.deliveryAddress.pincode}</p>
                <p>TEL: {labelModalOrder.deliveryAddress.phone}</p>
              </div>

              <div className="flex justify-between p-2 border border-black">
                <div>
                  <p className="text-[10px]">ORDER REF:</p>
                  <p className="font-bold">{labelModalOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-[10px]">PAYMENT MODE:</p>
                  <p className="font-bold">{labelModalOrder.paymentMethod}</p>
                </div>
              </div>

              <div className="text-center py-2 border border-black">
                <p className="text-sm font-bold tracking-widest font-mono">||||| | |||| |||| ||||| ||||</p>
                <p className="text-[10px]">{labelModalOrder.trackingId}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setLabelModalOrder(null)}
                className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 text-xs font-bold bg-black text-white rounded"
              >
                Print Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
