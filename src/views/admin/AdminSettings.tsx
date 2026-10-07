import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const AdminSettings: React.FC = () => {
  const { isAcceptingOrders, toggleAcceptingOrders } = useStore();
  const [storeName, setStoreName] = useState('Miras Heritage Foods');
  const [supportPhone, setSupportPhone] = useState('+91 98450 12345');
  const [supportEmail, setSupportEmail] = useState('support@mirasheritage.com');
  const [freeShipThreshold, setFreeShipThreshold] = useState(699);
  const [expressShipFee, setExpressShipFee] = useState(80);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="px-4 sm:px-8 py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4f00]">
          System & Configuration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f1b18]">
          Store Settings
        </h1>
        <p className="text-xs text-[#696159]">
          Manage order operational toggles, shipping rules, and contact information.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-[#a3f69c]/30 text-[#005c15] rounded-xl text-xs font-bold flex items-center gap-2 border border-[#a3f69c]">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>Store configurations updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-[#E8E2DA] p-6 shadow-xs space-y-6">
        <div>
          <h3 className="font-serif text-base font-bold text-[#1f1b18] mb-3">Store Operational Status</h3>
          <div className="flex items-center justify-between p-4 bg-[#fbf2ec] rounded-xl border border-[#ffdcc0]">
            <div>
              <p className="font-bold text-sm text-[#1f1b18]">Accept New Customer Orders</p>
              <p className="text-xs text-[#696159]">
                Toggle off during major national festival holidays or kitchen maintenance.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAcceptingOrders}
                onChange={toggleAcceptingOrders}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#eae1db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2E7D32]"></div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-[#1f1b18]">Delivery Pricing Thresholds</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#1f1b18] block mb-1">
                Complimentary Shipping Minimum (₹)
              </label>
              <input
                type="number"
                value={freeShipThreshold}
                onChange={e => setFreeShipThreshold(Number(e.target.value))}
                className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
              />
              <span className="text-[11px] text-[#696159] mt-0.5 block">
                Orders above this amount unlock standard free dispatch automatically.
              </span>
            </div>

            <div>
              <label className="font-bold text-[#1f1b18] block mb-1">
                Standard Express Courier Fee (₹)
              </label>
              <input
                type="number"
                value={expressShipFee}
                onChange={e => setExpressShipFee(Number(e.target.value))}
                className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
              />
              <span className="text-[11px] text-[#696159] mt-0.5 block">
                Applied when order subtotal is below complimentary threshold.
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-[#1f1b18]">Contact & Dispatch Hub</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#1f1b18] block mb-1">Store Legal Name</label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-[#1f1b18] block mb-1">WhatsApp Concierge Desk</label>
              <input
                type="text"
                value={supportPhone}
                onChange={e => setSupportPhone(e.target.value)}
                className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
              />
            </div>

            <div>
              <label className="font-bold text-[#1f1b18] block mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E8E2DA] flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#932616] hover:bg-[#b43e2b] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
          >
            Save Store Settings
          </button>
        </div>
      </form>
    </div>
  );
};
