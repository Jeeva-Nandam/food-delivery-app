import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const AdminLoginView: React.FC = () => {
  const { loginAdmin } = useStore();
  const [username, setUsername] = useState('Jeeva@admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const success = loginAdmin(username, password);
    if (!success) {
      setError('Access Denied: Invalid credentials. Please use default credentials: Jeeva@admin / adminadmin');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1f1b18] text-[#f8efea] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#932616]/25 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#D49B24]/15 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Lockup */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#932616] text-white shadow-lg mb-4 ring-4 ring-[#932616]/30">
            <span className="material-symbols-outlined text-3xl">skillet</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
            Miras Heritage Foods
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#D49B24] font-bold mt-1">
            Restricted Operations & Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#342f2c] rounded-2xl border border-[#eae1db]/15 shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-[#eae1db]/10">
            <span className="material-symbols-outlined text-[#D49B24] text-xl">admin_panel_settings</span>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Admin Authentication
              </h2>
              <p className="text-[11px] text-[#eae1db]/60">
                Authorized administrative personnel access only
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-[#ba1a1a]/20 border border-[#ba1a1a]/40 text-[#ffdad6] text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#eae1db]/80 mb-1.5">
                Admin Username / Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#eae1db]/40 text-lg pointer-events-none">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Jeeva@admin"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-white/5 border border-[#eae1db]/20 text-sm text-white placeholder:text-[#eae1db]/30 focus:outline-none focus:border-[#D49B24] focus:ring-1 focus:ring-[#D49B24] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#eae1db]/80 mb-1.5">
                Admin Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#eae1db]/40 text-lg pointer-events-none">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-white/5 border border-[#eae1db]/20 text-sm text-white placeholder:text-[#eae1db]/30 focus:outline-none focus:border-[#D49B24] focus:ring-1 focus:ring-[#D49B24] transition-all"
                />
              </div>
            </div>

            {/* Default Credentials Badge */}
            <div className="p-3 rounded-xl bg-[#D49B24]/10 border border-[#D49B24]/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#D49B24]">
                <span className="material-symbols-outlined text-sm">key</span>
                <span className="font-semibold">Default Credentials:</span>
              </div>
              <span className="font-mono text-white/90 text-[11px] font-bold">
                Jeeva@admin / adminadmin
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 mt-2 bg-[#932616] hover:bg-[#b43e2b] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              <span>Authenticate & Enter Portal</span>
            </button>
          </form>
        </div>

        {/* Security Footer Notice */}
        <div className="text-center mt-6 text-[#eae1db]/40 text-[11px]">
          <p className="flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-xs">shield</span>
            <span>Miras Heritage Cryptographic Gateway • End-to-End Encrypted Session</span>
          </p>
        </div>
      </div>
    </div>
  );
};
