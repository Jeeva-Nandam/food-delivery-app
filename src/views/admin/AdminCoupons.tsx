import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [maxDiscount, setMaxDiscount] = useState(200);
  const [minOrder, setMinOrder] = useState(499);
  const [description, setDescription] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    addCoupon({
      code: code.trim().toUpperCase(),
      discountPercent: Number(discountPercent),
      maxDiscount: Number(maxDiscount),
      minOrder: Number(minOrder),
      description: description || `${discountPercent}% off on orders above ₹${minOrder}`,
      isActive: true,
      timesUsed: 0,
    });
    setCode('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-8 py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4f00]">
            Growth & Marketing
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f1b18]">
            Offers & Discount Vouchers
          </h1>
          <p className="text-xs text-[#696159]">
            Configure festive campaign codes, minimum cart thresholds, and customer savings.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 px-4 bg-[#932616] hover:bg-[#b43e2b] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Create Promo Voucher</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {coupons.map(coupon => (
          <div
            key={coupon.code}
            className="bg-white rounded-xl border border-[#E8E2DA] p-5 shadow-xs flex flex-col justify-between gap-4 relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-base font-bold text-[#932616] bg-[#fbf2ec] px-2.5 py-1 rounded border border-[#ffdcc0]">
                  {coupon.code}
                </span>
                <p className="text-xs text-[#58413d] mt-3 font-semibold">{coupon.description}</p>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#a3f69c]/30 text-[#005c15]">
                {coupon.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="pt-3 border-t border-[#E8E2DA] flex items-center justify-between text-xs text-[#696159]">
              <div>
                <span>Discount: </span>
                <strong className="text-[#1f1b18]">{coupon.discountPercent}%</strong>
              </div>
              <div>
                <span>Redemptions: </span>
                <strong className="text-[#1f1b18]">{coupon.timesUsed}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2DA]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2DA]">
              <h3 className="font-serif text-lg font-bold text-[#1f1b18]">
                Create Discount Voucher
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI25"
                  required
                  className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1f1b18] block mb-1">Discount %</label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={e => setDiscountPercent(Number(e.target.value))}
                    required
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1f1b18] block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={e => setMaxDiscount(Number(e.target.value))}
                    required
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Min Order Value (₹)</label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={e => setMinOrder(Number(e.target.value))}
                  required
                  className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Special festive promo on orders over ₹499"
                  className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2DA]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#932616] text-white rounded-lg font-bold hover:bg-[#b43e2b]"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
