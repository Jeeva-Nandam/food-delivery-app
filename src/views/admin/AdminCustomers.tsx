import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { User } from '../../types';

export const AdminCustomers: React.FC = () => {
  const { customers, updateCustomer } = useStore();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateCustomer(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      phone: editingUser.phone,
      rewardCoins: Number(editingUser.rewardCoins),
      role: editingUser.role,
    });
    setEditingUser(null);
  };

  return (
    <div className="px-4 sm:px-8 py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4f00]">
            User & Connoisseur Analytics
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f1b18]">
            Customer Accounts ({customers.length})
          </h1>
          <p className="text-xs text-[#696159]">
            Manage culinary member profiles, loyalty reward coins, and view lifetime value.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#696159] text-base">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search customer name, email, phone..."
            className="w-full h-9 pl-9 pr-3 bg-white border border-[#E8E2DA] rounded-lg text-xs text-[#1f1b18] focus:outline-none"
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-xl border border-[#E8E2DA] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#fbf2ec] text-[#696159] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-3">Contact Details</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Total Orders</th>
                <th className="py-3 px-3">Lifetime Spent</th>
                <th className="py-3 px-3">Reward Coins</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2DA]">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ffdad4] text-[#932616] flex items-center justify-center font-bold text-xs">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-[#1f1b18] block">{c.name}</span>
                        {c.isVerified && (
                          <span className="text-[10px] text-[#005c15] flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            Google Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-[#1f1b18] block">{c.email}</span>
                    <span className="text-[11px] text-[#696159]">{c.phone}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.role === 'admin'
                          ? 'bg-[#342f2c] text-white'
                          : 'bg-[#FAF8F5] text-[#58413d] border border-[#E8E2DA]'
                      }`}
                    >
                      {c.role === 'admin' ? 'Super Admin' : 'Customer'}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-bold text-[#1f1b18]">
                    {c.totalOrders} orders
                  </td>

                  <td className="py-3.5 px-3 font-bold text-[#932616]">
                    ₹{c.totalSpent.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 font-bold text-[#8d4f00]">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      <span>{c.rewardCoins} coins</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setEditingUser(c)}
                      className="px-3 py-1 bg-[#fbf2ec] hover:bg-[#eae1db] text-[#932616] font-bold rounded-lg text-xs cursor-pointer"
                    >
                      Edit User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2DA]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2DA]">
              <h3 className="font-serif text-lg font-bold text-[#1f1b18]">
                Edit Customer Account
              </h3>
              <button onClick={() => setEditingUser(null)}>
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  required
                  className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                  className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-[#1f1b18] block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingUser.phone}
                  onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                  required
                  className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1f1b18] block mb-1">Reward Coins</label>
                  <input
                    type="number"
                    value={editingUser.rewardCoins}
                    onChange={e =>
                      setEditingUser({ ...editingUser, rewardCoins: Number(e.target.value) })
                    }
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1f1b18] block mb-1">System Role</label>
                  <select
                    value={editingUser.role}
                    onChange={e =>
                      setEditingUser({ ...editingUser, role: e.target.value as 'customer' | 'admin' })
                    }
                    className="w-full h-10 px-2 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E2DA]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#932616] text-white rounded-lg font-bold hover:bg-[#b43e2b]"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
