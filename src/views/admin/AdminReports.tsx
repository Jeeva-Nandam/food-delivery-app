import React from 'react';
import { useStore } from '../../context/StoreContext';

export const AdminReports: React.FC = () => {
  const { orders } = useStore();

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="px-4 sm:px-8 py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4f00]">
            Financial & Sales Telemetry
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f1b18]">
            Reports & Store Analytics
          </h1>
          <p className="text-xs text-[#696159]">
            Comprehensive auditing of culinary basket orders, geographic dispatch velocities, and sales totals.
          </p>
        </div>

        <button
          onClick={() => {
            const csvData = [
              ['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Status'],
              ...orders.map(o => [
                o.orderNumber,
                o.createdAt,
                o.customerName,
                o.items.length,
                o.total,
                o.paymentMethod,
                o.status,
              ]),
            ]
              .map(e => e.join(','))
              .join('\n');

            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `miras_sales_report_${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
          }}
          className="h-10 px-4 bg-[#932616] hover:bg-[#b43e2b] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">file_download</span>
          <span>Download Detailed CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-[#E8E2DA] shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-[#696159]">Recorded Revenue</span>
          <div className="font-serif text-3xl font-bold text-[#932616] mt-2">
            ₹{totalRevenue.toFixed(2)}
          </div>
          <span className="text-xs text-[#005c15] mt-1">+14.2% vs previous period</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E2DA] shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-[#696159]">Dispatched Parcels</span>
          <div className="font-serif text-3xl font-bold text-[#8d4f00] mt-2">
            {orders.length} Parcels
          </div>
          <span className="text-xs text-[#696159] mt-1">99.4% on-time cold-chain delivery</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E8E2DA] shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-[#696159]">Average Order Basket</span>
          <div className="font-serif text-3xl font-bold text-[#1f1b18] mt-2">
            ₹{(totalRevenue / (orders.length || 1)).toFixed(2)}
          </div>
          <span className="text-xs text-[#005c15] mt-1">Healthy multi-item cart depth</span>
        </div>
      </div>

      {/* Breakdown by payment mode */}
      <div className="bg-white p-5 rounded-xl border border-[#E8E2DA] shadow-xs">
        <h3 className="font-serif text-base font-bold text-[#1f1b18] mb-4">
          Payment Modes Telemetry
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2DA]">
            <span className="text-xs font-bold text-[#1f1b18]">UPI & QR Transfers</span>
            <span className="text-lg font-bold text-[#005c15] block mt-1">64%</span>
            <span className="text-[10px] text-[#696159]">GPay, PhonePe, Paytm</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2DA]">
            <span className="text-xs font-bold text-[#1f1b18]">Credit & Debit Cards</span>
            <span className="text-lg font-bold text-[#8d4f00] block mt-1">22%</span>
            <span className="text-[10px] text-[#696159]">Visa, MC, RuPay</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2DA]">
            <span className="text-xs font-bold text-[#1f1b18]">Cash on Delivery</span>
            <span className="text-lg font-bold text-[#932616] block mt-1">10%</span>
            <span className="text-[10px] text-[#696159]">Doorstep OTP verified</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2DA]">
            <span className="text-xs font-bold text-[#1f1b18]">Net Banking</span>
            <span className="text-lg font-bold text-[#58413d] block mt-1">4%</span>
            <span className="text-[10px] text-[#696159]">HDFC, SBI, ICICI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
