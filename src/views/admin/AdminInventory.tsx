import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const AdminInventory: React.FC = () => {
  const { products, updateProduct } = useStore();
  const [restockProduct, setRestockProduct] = useState<{ id: string; name: string; current: number } | null>(null);
  const [restockCount, setRestockCount] = useState(50);

  const handleRestock = () => {
    if (!restockProduct) return;
    updateProduct(restockProduct.id, {
      stock: restockProduct.current + restockCount,
      inStock: true,
    });
    setRestockProduct(null);
  };

  return (
    <div className="px-4 sm:px-8 py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4f00]">
            Artisan Production Batches
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f1b18]">
            Cluster Inventory & Batch Freshness
          </h1>
          <p className="text-xs text-[#696159]">
            Live tracking of small-batch churnings, brass tin reserves, and shelf life expirations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-[#a3f69c]/30 text-[#005c15] text-xs font-bold">
            All Batches Nitrogen-Flushed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#696159]">Total SKUs Monitored</span>
          <div className="font-serif text-2xl font-bold text-[#1f1b18] mt-1">{products.length} Items</div>
          <span className="text-[11px] text-[#005c15] mt-1 block">100% Native Provenance</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#696159]">Critical Restock Alert</span>
          <div className="font-serif text-2xl font-bold text-[#ba1a1a] mt-1">
            {products.filter(p => p.stock < 15).length} Items
          </div>
          <span className="text-[11px] text-[#ba1a1a] mt-1 block">Immediate churn required</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#696159]">Next Churn Arrival</span>
          <div className="font-serif text-2xl font-bold text-[#8d4f00] mt-1">4:30 PM Today</div>
          <span className="text-[11px] text-[#696159] mt-1 block">Madurai & Tirunelveli vans</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#696159]">Average Batch Age</span>
          <div className="font-serif text-2xl font-bold text-[#005c15] mt-1">18 Hours</div>
          <span className="text-[11px] text-[#005c15] mt-1 block">Strict 48h SLA maintained</span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-[#E8E2DA] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#fbf2ec] text-[#696159] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Cluster & Item</th>
                <th className="py-3 px-3">Batch ID</th>
                <th className="py-3 px-3">Shelf Life</th>
                <th className="py-3 px-3">Stock Left</th>
                <th className="py-3 px-3">Health Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2DA]">
              {products.map((p, idx) => {
                const batchId = `BATCH-${p.origin.slice(0, 3).toUpperCase()}-2026-${(idx + 1).toString().padStart(2, '0')}`;
                return (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded object-cover" />
                        <div>
                          <p className="font-bold text-[#1f1b18]">{p.name}</p>
                          <span className="text-[10px] text-[#696159]">{p.origin} • {p.weight}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-[#1f1b18]">{batchId}</td>
                    <td className="py-3 px-3 text-[#696159]">{p.shelfLife}</td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-sm text-[#1f1b18]">{p.stock} units</span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stock < 10
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : p.stock < 25
                            ? 'bg-[#ffdcc0] text-[#8d4f00]'
                            : 'bg-[#a3f69c]/30 text-[#005c15]'
                        }`}
                      >
                        {p.stock < 10 ? 'Critical Reorder' : p.stock < 25 ? 'Low Stock Alert' : 'Healthy Reserve'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setRestockProduct({ id: p.id, name: p.name, current: p.stock })}
                        className="px-3 py-1 bg-[#932616] hover:bg-[#b43e2b] text-white font-bold rounded-lg text-xs cursor-pointer"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {restockProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E8E2DA]">
            <h3 className="font-serif text-lg font-bold text-[#1f1b18] mb-1">
              Restock {restockProduct.name}
            </h3>
            <p className="text-xs text-[#696159] mb-4">
              Current stock: <strong>{restockProduct.current} units</strong>. Add incoming master batch churned units.
            </p>

            <div className="mb-4">
              <label className="text-[11px] font-bold uppercase text-[#696159] block mb-1">
                Units Received from Hub
              </label>
              <input
                type="number"
                value={restockCount}
                onChange={e => setRestockCount(Number(e.target.value))}
                min={1}
                className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg text-sm font-bold text-[#1f1b18]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRestockProduct(null)}
                className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleRestock}
                className="px-5 py-2 bg-[#932616] text-white rounded-lg text-xs font-bold hover:bg-[#b43e2b]"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
