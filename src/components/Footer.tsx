import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { navigate } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#fbf2ec] border-t border-[#E8E2DA] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand Info Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#b43e2b] flex items-center justify-center text-[#ffffff]">
                <span className="material-symbols-outlined text-xl">skillet</span>
              </div>
              <span className="font-serif text-2xl text-[#932616] font-bold">
                Miras Heritage
              </span>
            </div>
            <p className="text-sm text-[#696159] leading-relaxed">
              Reviving generational culinary recipes with pure native ingredients directly from indigenous producers.
            </p>

            {/* 100% Veg Certificate */}
            <div className="flex items-center gap-2 pt-1">
              <div className="w-4 h-4 border-2 border-[#2E7D32] flex items-center justify-center p-0.5 rounded-xs">
                <div className="w-2 h-2 rounded-full bg-[#2E7D32]"></div>
              </div>
              <span className="text-[11px] font-bold text-[#696159] uppercase tracking-wider">
                100% Vegetarian Certified
              </span>
            </div>

            {/* Seals */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#ffdcc0]/60 text-[#8d4f00] text-xs font-semibold">
                GI Tagged Provenance
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#FFFFFF] border border-[#E8E2DA] text-[#696159] text-xs font-semibold">
                FSSAI Certified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-[#1f1b18] uppercase tracking-wider mb-1">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#58413d]">
              <li>
                <button
                  onClick={() => navigate('shop-all')}
                  className="hover:text-[#932616] transition-colors cursor-pointer text-left"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('regional-sweets')}
                  className="hover:text-[#932616] transition-colors cursor-pointer text-left"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('shop-all')}
                  className="hover:text-[#932616] transition-colors cursor-pointer text-left"
                >
                  Festive Hampers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('savouries-and-mixtures')}
                  className="hover:text-[#932616] transition-colors cursor-pointer text-left"
                >
                  Savouries & Mixtures
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('handcrafted-pickles')}
                  className="hover:text-[#932616] transition-colors cursor-pointer text-left"
                >
                  Handcrafted Pickles
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-[#1f1b18] uppercase tracking-wider mb-1">
              Customer Care
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#58413d]">
              <li>
                <button
                  onClick={() => navigate('track-order')}
                  className="hover:text-[#932616] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Track Order</span>
                  <span className="text-[10px] bg-[#2E7D32]/10 text-[#2E7D32] px-1.5 py-0.5 rounded font-bold">
                    Live
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about-us')}
                  className="hover:text-[#932616] transition-colors cursor-pointer text-left"
                >
                  Shipping & Cold-Chain Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('contact')}
                  className="hover:text-[#932616] transition-colors cursor-pointer text-left"
                >
                  Transit Replacement Guarantee
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('contact')}
                  className="hover:text-[#932616] transition-colors cursor-pointer text-left"
                >
                  Culinary FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about-us')}
                  className="hover:text-[#932616] transition-colors cursor-pointer text-left"
                >
                  About Heritage Clusters
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-[#1f1b18] uppercase tracking-wider mb-1">
              Contact & Newsletter
            </h3>
            <div className="flex flex-col gap-2 text-sm text-[#58413d]">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#005c15]">call</span>
                <span>+91 98450 12345 (WhatsApp)</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#932616]">mail</span>
                <span>support@mirasheritage.com</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#8d4f00]">storefront</span>
                <span>Bangalore & Madurai Artisan Hubs</span>
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="mt-2 flex flex-col gap-2">
              <label className="text-[11px] font-bold text-[#696159] uppercase tracking-wider">
                Join our heirloom tasting club
              </label>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full h-11 px-3 bg-[#FFFFFF] rounded-l-lg border border-r-0 border-[#E8E2DA] text-sm text-[#1f1b18] placeholder:text-[#696159] focus:outline-none focus:border-[#b43e2b]"
                />
                <button
                  type="submit"
                  className="h-11 px-4 bg-[#932616] text-[#ffffff] text-sm font-bold rounded-r-lg hover:bg-[#b43e2b] transition-colors shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-[#005c15] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Thank you! You will receive our next seasonal tasting guide.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#E8E2DA] bg-[#FFFFFF] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center text-[#696159] text-xs">
          © 2025 Miras Heritage Foods Pvt. Ltd. All rights reserved. Made with love for authentic culinary traditions.
        </div>
      </div>
    </footer>
  );
};
