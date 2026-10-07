import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

export const AuthCheckView: React.FC = () => {
  const {
    cartItems,
    itemsSubtotal,
    grandTotal,
    loginWithGoogle,
    loginWithOtp,
    continueAsGuest,
    navigate,
  } = useStore();

  const [mobileNumber, setMobileNumber] = useState('9845277120');
  const [guestEmail, setGuestEmail] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [guestModalOpen, setGuestModalOpen] = useState(false);

  // Reservation countdown timer: 14 mins 59 secs
  const [secondsRemaining, setSecondsRemaining] = useState<number>(14 * 60 + 59);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = () => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} mins`;
  };

  const handleSendOtp = () => {
    if (mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
      setOtpError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setOtpError('');
    setOtpSent(true);
    setShowOtpField(true);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 4) {
      setOtpError('Please enter the 4-digit code sent to your handset');
      return;
    }
    loginWithOtp(mobileNumber);
    navigate('checkout');
  };

  const handleGoogleSignIn = () => {
    loginWithGoogle();
    navigate('checkout');
  };

  const handleGuestSubmit = () => {
    continueAsGuest(guestEmail);
    navigate('checkout');
  };

  return (
    <div className="w-full">
      <div className="relative w-full py-8 md:py-12 px-4 sm:px-8 overflow-hidden">
        {/* Decorative soft glow backdrops */}
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-[#ffdcc0]/30 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#ffdad4]/25 blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto w-full">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              onClick={() => navigate('cart')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#696159] hover:text-[#932616] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Cart Review</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0e6e1] text-[#58413d] text-[11px] font-bold">
              <span className="inline-block w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
              <span>Express Checkout Pipeline</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Sign In / Auth Portal (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl p-6 sm:p-8 shadow-md border border-[#E8E2DA]">
              <div className="flex flex-col gap-2 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#fbf2ec] flex items-center justify-center text-[#932616]">
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      shield_person
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8d4f00]">
                      Miras Heritage Gateway
                    </span>
                    <span className="text-xs text-[#696159]">
                      Direct Farm & Artisanal Origin Access
                    </span>
                  </div>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f1b18] tracking-tight mt-1">
                  Sign in to complete your order
                </h1>
                <p className="text-sm text-[#696159] leading-relaxed">
                  Sign in securely with Google to automatically retrieve your delivery details, track express transit, and enjoy 1-click orders.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="group relative w-full h-14 px-5 rounded-lg bg-white hover:bg-[#fff8f5] shadow-xs hover:shadow border border-[#E8E2DA] transition-all flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" viewBox="0 0 48 48">
                        <path
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                          fill="#EA4335"
                        ></path>
                        <path
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                          fill="#4285F4"
                        ></path>
                        <path
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                          fill="#FBBC05"
                        ></path>
                        <path
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                          fill="#34A853"
                        ></path>
                      </svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-[#1f1b18] group-hover:text-[#932616] transition-colors">
                        Continue with Google
                      </span>
                      <span className="text-[11px] text-[#696159]">
                        Official fast authentication
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#696159] group-hover:translate-x-1 group-hover:text-[#932616] transition-all">
                    arrow_forward
                  </span>
                </button>

                {/* Divider */}
                <div className="relative py-1 flex items-center justify-center">
                  <div className="w-full h-px bg-[#eae1db]"></div>
                  <span className="absolute px-4 bg-white text-[11px] uppercase tracking-wider font-bold text-[#696159]">
                    or sign in with mobile OTP
                  </span>
                </div>

                {/* Mobile Form */}
                <form onSubmit={e => { e.preventDefault(); handleSendOtp(); }} className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-[#1f1b18]">
                    Indian Mobile Number
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="flex-1 flex rounded-lg bg-white border border-[#E8E2DA] shadow-xs overflow-hidden">
                      <div className="px-3.5 flex items-center justify-center bg-[#fbf2ec] text-[#58413d] text-sm font-bold shrink-0 select-none border-r border-[#E8E2DA]">
                        +91
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 10 digit phone number"
                        className="w-full h-11 px-3.5 bg-transparent text-sm text-[#1f1b18] placeholder:text-[#696159] focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="h-11 px-6 rounded-lg bg-[#b43e2b] hover:bg-[#932616] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm cursor-pointer"
                    >
                      <span>{otpSent ? 'Resend OTP' : 'Send OTP'}</span>
                      <span className="material-symbols-outlined text-base">send</span>
                    </button>
                  </div>

                  {otpError && (
                    <p className="text-xs text-[#ba1a1a] font-semibold">{otpError}</p>
                  )}

                  {otpSent && !showOtpField && (
                    <p className="text-xs text-[#005c15] flex items-center gap-1.5 mt-1">
                      <span className="material-symbols-outlined text-sm">mark_chat_read</span>
                      <span>Verification code sent via SMS & WhatsApp.</span>
                    </p>
                  )}

                  {/* OTP Input Field */}
                  {showOtpField && (
                    <div className="p-4 rounded-xl bg-[#fbf2ec] border border-[#ffdcc0] mt-2 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1f1b18]">Enter 4-digit OTP Code:</span>
                        <span className="text-[11px] text-[#8d4f00]">Sent to +91 {mobileNumber}</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          placeholder="e.g. 4821"
                          className="w-40 h-11 px-3 bg-white border border-[#E8E2DA] rounded-lg text-center tracking-widest text-lg font-bold text-[#1f1b18] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="h-11 px-6 bg-[#932616] hover:bg-[#b43e2b] text-white text-sm font-bold rounded-lg cursor-pointer"
                        >
                          Verify & Proceed
                        </button>
                      </div>
                      <span className="text-[11px] text-[#696159]">
                        (Hint for preview: enter any 4 numbers like 1234)
                      </span>
                    </div>
                  )}
                </form>

                {/* Benefits of signing in */}
                <div className="p-4 rounded-lg bg-[#fbf2ec] flex flex-col gap-2.5 mt-1 border border-[#E8E2DA]">
                  <span className="text-[11px] uppercase tracking-wider text-[#58413d] font-bold">
                    Benefits of signing in
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white shadow-xs">
                      <span
                        className="material-symbols-outlined text-[#005c15] text-lg shrink-0 mt-0.5"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        chat
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#1f1b18]">WhatsApp Updates</span>
                        <span className="text-[11px] text-[#696159]">Live dispatch alerts</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white shadow-xs">
                      <span
                        className="material-symbols-outlined text-[#932616] text-lg shrink-0 mt-0.5"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        pin_drop
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#1f1b18]">Saved Addresses</span>
                        <span className="text-[11px] text-[#696159]">1-Click reordering</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white shadow-xs">
                      <span
                        className="material-symbols-outlined text-[#8d4f00] text-lg shrink-0 mt-0.5"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        monetization_on
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[#1f1b18]">50 Reward Coins</span>
                        <span className="text-[11px] text-[#696159]">Applied right now</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Checkout Option */}
                <div className="pt-2 flex flex-col items-center gap-3 text-center">
                  <button
                    type="button"
                    onClick={() => setGuestModalOpen(true)}
                    className="text-sm font-bold text-[#1f1b18] hover:text-[#932616] transition-colors underline decoration-[#8d4f00] decoration-1 underline-offset-4 cursor-pointer"
                  >
                    Continue as Guest with email
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[#696159] text-xs">
                    <span
                      className="material-symbols-outlined text-sm text-[#005c15]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      lock
                    </span>
                    <span>256-bit SSL encrypted • We never share your personal information or spam.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Cart Summary & Guarantee (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8E2DA]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E2DA]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#932616] text-xl">
                      shopping_cart_checkout
                    </span>
                    <h2 className="text-sm font-bold text-[#1f1b18]">
                      Cart Summary ({cartItems.length})
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#8d4f00] font-bold uppercase tracking-wider">
                    Fast Dispatch
                  </span>
                </div>

                {/* Reservation countdown timer */}
                <div className="mb-3 px-3 py-2 rounded-lg bg-[#f0e6e1] flex items-center justify-between text-[#58413d]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#8d4f00] animate-spin">
                      alarm
                    </span>
                    <span className="text-xs">Your cart items are reserved for:</span>
                  </div>
                  <span className="text-sm font-bold text-[#932616] tabular-nums font-mono">
                    {formatTimer()}
                  </span>
                </div>

                {/* Cart Items List */}
                <div className="flex flex-col gap-2.5">
                  {cartItems.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-[#fbf2ec]/50 border border-[#E8E2DA]/50"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-[#1f1b18] truncate">
                            {product.name}
                          </p>
                          <span className="text-xs font-bold text-[#1f1b18] shrink-0">
                            ₹{product.price * quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#696159]">
                          <span>{product.weight}</span>
                          <span>•</span>
                          <span className="text-[#005c15] font-semibold">Qty: {quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ledger Breakdown */}
                <div className="mt-4 pt-3 border-t border-[#E8E2DA] flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between text-[#696159]">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="text-[#1f1b18] font-semibold">₹{itemsSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#696159]">
                    <span>Direct Artisan Delivery</span>
                    <span className="text-[#005c15] font-bold">FREE (Above ₹699)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#696159]">
                    <span>First Login Heritage Credit</span>
                    <span className="text-[#8d4f00] font-semibold">-₹50.00 Applied</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#E8E2DA] flex items-center justify-between text-base font-bold text-[#1f1b18]">
                    <span>Total Payable</span>
                    <span className="text-[#932616] font-serif text-lg">
                      ₹{Math.max(0, grandTotal - 50).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Purity Pledge */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E2DA] shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1f1b18]">Artisanal Purity Pledge</span>
                  <span className="text-[11px] text-[#696159]">
                    Directly dispatching fresh small-batches from original geo-hubs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Checkout Modal */}
      {guestModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2DA]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-[#1f1b18]">Guest Checkout</h3>
              <button
                onClick={() => setGuestModalOpen(false)}
                className="text-[#696159] hover:text-[#1f1b18]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <p className="text-xs text-[#696159] mb-4">
              Enter your email to receive order receipts, live BlueDart tracking links, and kitchen dispatch notifications.
            </p>
            <input
              type="email"
              value={guestEmail}
              onChange={e => setGuestEmail(e.target.value)}
              placeholder="e.g. yourname@example.com"
              className="w-full h-11 px-3.5 bg-[#fff8f5] border border-[#E8E2DA] rounded-lg text-sm text-[#1f1b18] mb-4 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setGuestModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#696159] hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleGuestSubmit}
                className="px-5 py-2 bg-[#932616] text-white text-xs font-bold rounded-lg hover:bg-[#b43e2b]"
              >
                Proceed as Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
