import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const CartView: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemsSubtotal,
    couponDiscount,
    shippingFee,
    freeShippingThreshold,
    grandTotal,
    totalSavings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isGiftUnlocked,
    totalCartCount,
    navigate,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [savedForLater, setSavedForLater] = useState<string[]>([]);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const result = applyCoupon(promoInput);
    setPromoMessage({ text: result.message, isError: !result.success });
    if (result.success) {
      setPromoInput('');
    }
  };

  const handleSaveForLater = (productId: string) => {
    setSavedForLater(prev => [...prev, productId]);
    removeFromCart(productId);
  };

  // Distance from free shipping calculation
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - itemsSubtotal);
  const progressPercent = Math.min(100, Math.round((itemsSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 md:py-12">
        {/* Breadcrumb & Guest Freedom Alert */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-[#696159] text-xs">
            <button
              onClick={() => navigate('home')}
              className="hover:text-[#932616] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-[#1f1b18] font-semibold">Your Artisanal Pantry Basket</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fbf2ec] shadow-xs">
            <span
              className="material-symbols-outlined text-sm text-[#2E7D32]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock_open
            </span>
            <span className="text-[11px] font-semibold text-[#58413d]">
              Guest Checkout Active • No Account Required
            </span>
          </div>
        </div>

        {/* Editorial Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold text-[#8d4f00] uppercase tracking-widest mb-1">
              Direct from Native Masters
            </p>
            <h1 className="font-serif text-3xl md:text-5xl text-[#1f1b18] font-bold tracking-tight">
              Your Culinary Selections
            </h1>
          </div>
          <p className="text-sm text-[#696159]">
            Batches curated from Tamil Nadu & Andhra heritage clusters.
          </p>
        </div>

        {/* Free Shipping Progress Tracker Card */}
        <div className="relative overflow-hidden rounded-xl bg-white p-5 md:p-6 shadow-sm border border-[#E8E2DA] mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffdcc0] flex items-center justify-center text-[#2d1600] shrink-0">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-[#1f1b18]">
                  {amountToFreeShipping > 0 ? (
                    <>
                      You are only <span className="text-[#932616] font-bold">₹{amountToFreeShipping} away</span> from{' '}
                      <span className="text-[#2E7D32] font-bold">Complimentary Shipping</span>!
                    </>
                  ) : (
                    <>
                      <span className="text-[#2E7D32] font-bold">Complimentary Shipping Unlocked!</span> Free door delivery included.
                    </>
                  )}
                </h3>
                <p className="text-xs text-[#696159]">
                  Standard free door dispatch unlocks automatically on orders over ₹699.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded bg-[#f0e6e1] text-[#58413d] shrink-0">
              ₹{itemsSubtotal} of ₹699 Achieved
            </span>
          </div>

          {/* Meter Bar & Indicator */}
          <div className="w-full bg-[#eae1db] h-2.5 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-[#D49B24] to-[#2E7D32] rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between mt-2 text-[11px] text-[#696159]">
            <span className="flex items-center gap-1 text-[#2E7D32] font-semibold">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              {amountToFreeShipping === 0
                ? 'Free Shipping Threshold Met for Current Order'
                : `Add ₹${amountToFreeShipping} more to unlock free express transit`}
            </span>
            <span className="font-semibold text-[#932616]">Fast Dispatch: Within 24 Hours</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Basket Items & Micro-Actions (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E8E2DA] p-10 text-center flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-5xl text-[#696159]">
                  remove_shopping_cart
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1f1b18]">
                  Your culinary basket is empty
                </h3>
                <p className="text-sm text-[#696159] max-w-md">
                  Explore fresh small-batch confections and authentic regional savouries direct from master producers.
                </p>
                <button
                  onClick={() => navigate('home')}
                  className="mt-2 px-6 py-2.5 bg-[#932616] text-white rounded-lg text-sm font-bold shadow hover:bg-[#b43e2b] transition-colors"
                >
                  Browse Regional Delicacies
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cartItems.map(({ product, quantity }) => {
                  const lineTotal = product.price * quantity;
                  return (
                    <div
                      key={product.id}
                      className="rounded-xl bg-white p-4 sm:p-5 shadow-sm border border-[#E8E2DA] transition-all hover:shadow-md flex flex-col sm:flex-row gap-5 items-stretch relative"
                    >
                      {/* Product Image Frame */}
                      <div className="relative w-full sm:w-32 h-36 sm:h-32 rounded-lg overflow-hidden shrink-0 bg-[#f6ece7]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded-xs flex items-center justify-center p-0.5 shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-[#2E7D32]"></div>
                        </div>
                      </div>

                      {/* Product Body */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {product.badge && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#ffdcc0]/50 text-[#8d4f00]">
                                  {product.badge}
                                </span>
                              )}
                              <span className="text-xs text-[#696159]">{product.origin}</span>
                            </div>

                            <h2
                              onClick={() => navigate('product-detail', { productId: product.id })}
                              className="font-serif text-lg font-bold text-[#1f1b18] tracking-tight hover:text-[#932616] transition-colors cursor-pointer line-clamp-1"
                            >
                              {product.name}
                            </h2>
                            <p className="text-xs text-[#696159] mt-0.5">
                              {product.weight} Air-sealed Pack • Fresh Artisanal Batch
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-lg font-bold text-[#1f1b18]">₹{lineTotal}</div>
                            {quantity > 1 ? (
                              <div className="text-xs text-[#696159]">
                                (₹{product.price} × {quantity})
                              </div>
                            ) : (
                              <div className="text-xs text-[#696159] line-through">
                                ₹{product.originalPrice}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Controls Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 bg-[#fbf2ec]/50 rounded-lg px-3 py-2">
                          {/* Stepper */}
                          <div className="flex items-center bg-white rounded-lg shadow-xs border border-[#E8E2DA]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              aria-label="Decrease quantity"
                              className="w-8 h-8 flex items-center justify-center text-[#58413d] hover:text-[#932616] transition-colors text-lg font-bold cursor-pointer"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-[#1f1b18] select-none">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center text-[#58413d] hover:text-[#932616] transition-colors text-lg font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-xs text-[#696159]">
                              Subtotal: <span className="font-bold text-[#1f1b18]">₹{lineTotal.toFixed(2)}</span>
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveForLater(product.id)}
                                title="Save for Later"
                                className="p-1.5 text-[#696159] hover:text-[#8d4f00] transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-lg">bookmark_add</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => removeFromCart(product.id)}
                                title="Remove item"
                                className="p-1.5 text-[#696159] hover:text-[#ba1a1a] transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Complimentary Tier Unlock Banner */}
            {isGiftUnlocked && (
              <div className="rounded-xl bg-[#fbf2ec] p-4 shadow-sm border border-[#ffdcc0] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D49B24]/15 flex items-center justify-center text-2xl shrink-0">
                  🎁
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#25752b] text-white uppercase tracking-wider">
                      Unlocked Gift
                    </span>
                    <span className="text-sm font-bold text-[#1f1b18]">
                      Complimentary 50g Sample of Filter Coffee Podi
                    </span>
                  </div>
                  <p className="text-xs text-[#696159] mt-0.5">
                    Chikmagalur 80:20 Arabica-Chicory blend automatically added to your parcel at zero cost.
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-sm font-bold text-[#2E7D32] uppercase tracking-wider">
                    FREE
                  </span>
                </div>
              </div>
            )}

            {/* Cart Footer Secondary Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('home')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#932616] hover:text-[#b43e2b] transition-colors py-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Continue Exploring Heirloom Pantry</span>
              </button>

              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#696159] hover:text-[#ba1a1a] transition-colors py-2 px-3 rounded-lg hover:bg-white cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">remove_shopping_cart</span>
                  <span>Clear All Cart</span>
                </button>
              )}
            </div>

            {/* Heritage Promise Mini Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex items-start gap-3">
                <span className="material-symbols-outlined text-[#8d4f00] text-2xl shrink-0">history_edu</span>
                <div>
                  <p className="text-sm font-bold text-[#1f1b18]">Native Recipes</p>
                  <p className="text-xs text-[#696159] mt-0.5">Crafted with authentic multigenerational formulas.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex items-start gap-3">
                <span className="material-symbols-outlined text-[#005c15] text-2xl shrink-0">spa</span>
                <div>
                  <p className="text-sm font-bold text-[#1f1b18]">No Artificials</p>
                  <p className="text-xs text-[#696159] mt-0.5">Zero chemical preservatives, additives or palm oil.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex items-start gap-3">
                <span className="material-symbols-outlined text-[#D49B24] text-2xl shrink-0">inventory_2</span>
                <div>
                  <p className="text-sm font-bold text-[#1f1b18]">Fresh Batches</p>
                  <p className="text-xs text-[#696159] mt-0.5">Small batch churned and packed within 48h of order.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary & Checkout Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 flex flex-col gap-5">
              {/* Summary Sheet Box */}
              <div className="rounded-xl bg-white p-6 shadow-md border border-[#E8E2DA] flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-[#1f1b18] tracking-tight">
                    Order Summary
                  </h2>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#f0e6e1] text-[#58413d]">
                    {totalCartCount} Delicacies
                  </span>
                </div>

                {/* Coupon Redemption Block */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#696159]">
                    Artisan Discount Voucher
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      placeholder="Enter Promo Code"
                      className="flex-1 h-11 px-3 bg-[#fff8f5] rounded-lg text-sm uppercase text-[#1f1b18] focus:outline-none border border-[#E8E2DA] font-semibold"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="h-11 px-5 bg-[#eae1db] hover:bg-[#e1d8d3] text-sm text-[#1f1b18] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>

                  {promoMessage && (
                    <p className={`text-xs ${promoMessage.isError ? 'text-[#ba1a1a]' : 'text-[#005c15]'}`}>
                      {promoMessage.text}
                    </p>
                  )}

                  {/* Active Applied Coupon Pill */}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#ffdcc0]/40 text-[#6b3b00] border border-[#ffdcc0]">
                      <div className="flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-base text-[#8d4f00]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-xs text-[#696159] font-medium">
                          (-₹{couponDiscount.toFixed(2)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-[11px] text-[#ba1a1a] hover:underline uppercase font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown Calculation Grid */}
                <div className="flex flex-col gap-3 text-sm text-[#58413d]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#696159]">Items Subtotal</span>
                    <span className="font-semibold text-[#1f1b18]">₹{itemsSubtotal.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-[#2E7D32] font-semibold">
                      <span>Coupon Discount ({appliedCoupon.discountPercent}%)</span>
                      <span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#696159]">Pan-India Express Delivery</span>
                      <span
                        className="material-symbols-outlined text-sm text-[#696159] cursor-pointer"
                        title="Free delivery unlocked for orders > ₹699"
                      >
                        info
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#696159] line-through text-xs">₹80.00</span>
                      <span className="font-bold text-[#2E7D32] uppercase text-xs">
                        {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#696159]">Taxes & Food Grade Packaging</span>
                    <span className="text-xs font-bold text-[#696159] uppercase">
                      INCLUDED
                    </span>
                  </div>

                  {/* Horizontal Divider */}
                  <div className="h-px bg-[#eae1db] my-1"></div>

                  {/* Grand Total */}
                  <div className="flex justify-between items-baseline pt-1">
                    <div>
                      <span className="font-serif text-lg font-bold text-[#1f1b18]">Grand Total</span>
                      <p className="text-[11px] text-[#2E7D32] font-bold mt-0.5">
                        Total Savings: ₹{totalSavings.toFixed(2)} today
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-2xl font-bold text-[#932616]">
                        ₹{grandTotal.toFixed(2)}
                      </span>
                      <p className="text-xs text-[#696159]">All inclusive</p>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button: Next step in flow */}
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    disabled={cartItems.length === 0}
                    onClick={() => navigate('auth-check')}
                    className="w-full h-12 bg-[#932616] hover:bg-[#b43e2b] disabled:opacity-50 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group tracking-wide uppercase cursor-pointer"
                  >
                    <span>PROCEED TO CHECKOUT</span>
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[#696159] text-xs pt-1">
                    <span
                      className="material-symbols-outlined text-sm text-[#2E7D32]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      bolt
                    </span>
                    <span>Speedy 1-Minute Guest Checkout</span>
                  </div>
                </div>

                {/* Trust Seals */}
                <div className="flex flex-col gap-2.5 pt-4 bg-[#fbf2ec]/50 rounded-lg p-3 border border-[#E8E2DA]/60">
                  <div className="flex items-center gap-2 text-[#58413d] text-xs">
                    <span className="material-symbols-outlined text-base text-[#005c15]">verified_user</span>
                    <span>100% Authentic Native Provenance Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#58413d] text-xs">
                    <span className="material-symbols-outlined text-base text-[#8d4f00]">lock</span>
                    <span>Safe & Secure 256-Bit SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#58413d] text-xs">
                    <span className="material-symbols-outlined text-base text-[#932616]">published_with_changes</span>
                    <span>Instant Replacement / Easy Refund on Damaged Transit</span>
                  </div>
                </div>

                {/* Accepted Payments Lockup */}
                <div className="flex flex-col gap-2 pt-1 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-[#696159] font-bold">
                    Accepted Payment Modes
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="h-7 px-2.5 rounded bg-[#fff8f5] shadow-xs border border-[#E8E2DA] flex items-center justify-center font-bold text-xs text-[#1f1b18]">
                      UPI
                    </span>
                    <span className="h-7 px-2.5 rounded bg-[#fff8f5] shadow-xs border border-[#E8E2DA] flex items-center justify-center font-semibold text-xs text-[#1f1b18]">
                      Google Pay
                    </span>
                    <span className="h-7 px-2.5 rounded bg-[#fff8f5] shadow-xs border border-[#E8E2DA] flex items-center justify-center font-semibold text-xs text-[#1f1b18]">
                      PhonePe
                    </span>
                    <span className="h-7 px-2.5 rounded bg-[#fff8f5] shadow-xs border border-[#E8E2DA] flex items-center justify-center font-semibold text-xs text-[#1f1b18]">
                      Paytm
                    </span>
                    <span className="h-7 px-2.5 rounded bg-[#fff8f5] shadow-xs border border-[#E8E2DA] flex items-center justify-center font-bold text-xs text-[#932616]">
                      VISA
                    </span>
                    <span className="h-7 px-2.5 rounded bg-[#fff8f5] shadow-xs border border-[#E8E2DA] flex items-center justify-center font-bold text-xs text-[#8d4f00]">
                      MC
                    </span>
                    <span className="h-7 px-2.5 rounded bg-[#fff8f5] shadow-xs border border-[#E8E2DA] flex items-center justify-center font-semibold text-xs text-[#1f1b18]">
                      NetBanking
                    </span>
                    <span className="h-7 px-2.5 rounded bg-[#fff8f5] shadow-xs border border-[#E8E2DA] flex items-center justify-center font-bold text-xs text-[#005c15]">
                      COD Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Need Assistance Pill */}
              <div className="rounded-xl bg-white p-4 shadow-sm border border-[#E8E2DA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-[#2E7D32]">
                    support_agent
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#1f1b18]">Questions on your order?</p>
                    <p className="text-[11px] text-[#696159]">Instant WhatsApp culinary desk</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/919845012345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#2E7D32] hover:underline font-bold uppercase"
                >
                  Chat Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
