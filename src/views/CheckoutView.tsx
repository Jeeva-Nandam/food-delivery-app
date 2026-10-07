import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Address } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    cartItems,
    itemsSubtotal,
    couponDiscount,
    grandTotal,
    currentUser,
    selectedAddress,
    setSelectedAddress,
    savedAddresses,
    addAddress,
    createOrder,
    navigate,
    appliedCoupon,
    removeCoupon,
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cards' | 'netbanking' | 'cod'>('upi');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [vpaId, setVpaId] = useState('ananya.sharma@okaxis');
  const [vpaVerified, setVpaVerified] = useState(true);
  const [vpaMessage, setVpaMessage] = useState('Verified: Ananya Sharma (State Bank of India)');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('Ananya Sharma');

  // Net banking selection
  const [selectedBank, setSelectedBank] = useState('hdfc');

  // Address Modal
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('Parent House');
  const [newAddrRecipient, setNewAddrRecipient] = useState(currentUser?.name || 'Ananya Sharma');
  const [newAddrPhone, setNewAddrPhone] = useState(currentUser?.phone || '+91 98452 77120');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Bengaluru');
  const [newAddrState, setNewAddrState] = useState('Karnataka');
  const [newAddrPin, setNewAddrPin] = useState('560001');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVerifyUpi = () => {
    if (!vpaId || !vpaId.includes('@')) {
      setVpaVerified(false);
      setVpaMessage('Please enter a valid UPI address (e.g. yourname@upi)');
    } else {
      setVpaVerified(true);
      setVpaMessage(`Verified: ${currentUser?.name || 'Customer'} (${vpaId})`);
    }
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet || !newAddrPin) return;
    const newAddress: Omit<Address, 'id'> = {
      title: newAddrTitle,
      recipientName: newAddrRecipient,
      phone: newAddrPhone,
      street: newAddrStreet,
      city: newAddrCity,
      state: newAddrState,
      pincode: newAddrPin,
      isDefault: false,
    };
    addAddress(newAddress);
    setAddressModalOpen(false);
  };

  const handlePayAndPlaceOrder = () => {
    setIsProcessing(true);

    let methodLabel: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery' = 'UPI';
    let details = 'UPI Instant';

    if (paymentMethod === 'upi') {
      methodLabel = 'UPI';
      details = `UPI · ${vpaId}`;
    } else if (paymentMethod === 'cards') {
      methodLabel = 'Card';
      details = `Card ending ${cardNumber.slice(-4) || '8842'}`;
    } else if (paymentMethod === 'netbanking') {
      methodLabel = 'NetBanking';
      details = `NetBanking · ${selectedBank.toUpperCase()}`;
    } else if (paymentMethod === 'cod') {
      methodLabel = 'Cash on Delivery';
      details = 'Cash on Delivery · Doorstep OTP';
    }

    setTimeout(() => {
      const order = createOrder(methodLabel, details, deliveryNote);
      setIsProcessing(false);
      navigate('order-success', { orderNumber: order.orderNumber });
    }, 900);
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 pb-16">
        {/* Breadcrumb & Trust Banner */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#696159]">
            <button
              onClick={() => navigate('cart')}
              className="hover:text-[#932616] transition-colors cursor-pointer"
            >
              Cart
            </button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-[#1f1b18] font-bold">One-Page Secure Checkout</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdcc0]/40 text-[#8d4f00] text-[11px] font-bold">
              <span className="material-symbols-outlined text-sm">lock</span>
              256-Bit SSL Encrypted
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#a3f69c]/30 text-[#005c15] text-[11px] font-bold">
              <span className="material-symbols-outlined text-sm">inventory_2</span>
              Dispatched from Artisan Hub
            </span>
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Checkout Journey (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Step 1: Customer Account & Authentication */}
            <section className="bg-white rounded-xl shadow-xs border border-[#E8E2DA] p-5 sm:p-6 relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#ffdad4] flex items-center justify-center text-[#932616] font-bold text-sm">
                    {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AS'}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#1f1b18]">
                        {currentUser?.name || 'Ananya Sharma'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f0e6e1] text-[#932616] text-[10px] font-bold">
                        <span
                          className="material-symbols-outlined text-xs"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                        Verified Customer
                      </span>
                    </div>
                    <span className="text-xs text-[#696159]">
                      {currentUser?.email || 'ananya.sharma@gmail.com'} • {currentUser?.phone || '+91 98452 77120'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('auth-check')}
                  className="text-xs text-[#932616] hover:text-[#b43e2b] font-bold transition-colors cursor-pointer"
                >
                  Switch
                </button>
              </div>
            </section>

            {/* Step 2: Delivery Destination & Notes */}
            <section className="bg-white rounded-xl shadow-xs border border-[#E8E2DA] p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#932616] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-serif text-lg font-bold text-[#1f1b18]">
                    Delivery Address
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs text-[#932616] font-bold hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add New Address
                </button>
              </div>

              {/* Saved Addresses List */}
              <div className="flex flex-col gap-3">
                {savedAddresses.map(addr => {
                  const isSelected = selectedAddress.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`rounded-xl p-4 flex items-start justify-between gap-3 relative cursor-pointer border transition-all ${
                        isSelected
                          ? 'bg-[#fbf2ec] border-[#932616]/40 shadow-xs'
                          : 'bg-white border-[#E8E2DA] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#932616] text-white'
                              : 'border-2 border-[#E8E2DA]'
                          }`}
                        >
                          {isSelected && (
                            <span className="material-symbols-outlined text-xs font-bold">check</span>
                          )}
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#1f1b18]">{addr.title}</span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded bg-white text-[#696159] text-[10px] font-bold uppercase">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#58413d] leading-relaxed">
                            {addr.street}, {addr.city}, {addr.state} —{' '}
                            <strong className="text-[#1f1b18]">{addr.pincode}</strong>
                          </p>
                          <span className="text-[11px] text-[#696159] mt-0.5">
                            Recipient: {addr.recipientName} ({addr.phone})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Instructions */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="delivery-note"
                  className="text-xs text-[#696159] font-semibold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">note_add</span>
                  Delivery Instructions (Optional)
                </label>
                <input
                  id="delivery-note"
                  type="text"
                  value={deliveryNote}
                  onChange={e => setDeliveryNote(e.target.value)}
                  placeholder="e.g. Leave with gate security / Ring bell twice / Avoid plastic tape"
                  className="w-full h-11 px-3.5 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg text-xs text-[#1f1b18] placeholder:text-[#696159]/70 focus:outline-none focus:bg-white"
                />
              </div>
            </section>

            {/* Step 3: Express Heritage Shipping Method */}
            <section className="bg-white rounded-xl shadow-xs border border-[#E8E2DA] p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#932616] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif text-lg font-bold text-[#1f1b18]">
                  Shipping Speed
                </h2>
              </div>

              <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#ffdcc0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#ffdcc0]/50 flex items-center justify-center text-[#8d4f00] shrink-0">
                    <span className="material-symbols-outlined text-xl">local_shipping</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1f1b18]">
                        Express Heritage Cold-Chain Dispatch
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#a3f69c] text-[#005c15] text-[10px] font-bold">
                        FASTEST
                      </span>
                    </div>
                    <p className="text-xs text-[#696159] mt-0.5">
                      Estimated Arrival: <strong className="text-[#1f1b18]">Tomorrow by 2:00 PM</strong>
                    </p>
                    <p className="text-[11px] text-[#8d4f00] mt-0.5">
                      Dispatched with fresh leaf-wrapping from native master confectioners
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-[#005c15]">FREE</span>
                  <span className="block line-through text-[11px] text-[#696159]">₹75.00</span>
                </div>
              </div>
            </section>

            {/* Step 4: Multi-Option Payment Gateway */}
            <section className="bg-white rounded-xl shadow-xs border border-[#E8E2DA] p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#932616] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#1f1b18]">
                      Select Payment Method
                    </h2>
                    <p className="text-xs text-[#696159]">
                      All transactions are RBI compliant and 256-bit encrypted
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#8d4f00]">security</span>
              </div>

              {/* Payment Tabs / Radio Options */}
              <div className="flex flex-col gap-3">
                {/* OPTION A: UPI (Instant Transfer) */}
                <div
                  className={`rounded-xl overflow-hidden border transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-[#FAF8F5] border-[#932616]/60 shadow-xs'
                      : 'bg-white border-[#E8E2DA]'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="checkout_payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="w-4 h-4 accent-[#932616]"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#1f1b18]">
                            UPI — Instant Transfer
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#ffdad4] text-[#932616] text-[10px] font-bold">
                            Fastest & Zero Fee
                          </span>
                        </div>
                        <span className="text-xs text-[#696159]">
                          Google Pay, PhonePe, Paytm, BHIM, or any UPI ID
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-white text-[11px] font-bold text-[#1f1b18] border border-[#E8E2DA]">
                        GPay
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-[11px] font-bold text-[#1f1b18] border border-[#E8E2DA]">
                        PhonePe
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-[11px] font-bold text-[#1f1b18] border border-[#E8E2DA]">
                        Paytm
                      </span>
                    </div>
                  </label>

                  {paymentMethod === 'upi' && (
                    <div className="px-5 pb-5 pt-1 flex flex-col gap-4 border-t border-[#E8E2DA]/60">
                      <div className="p-3.5 rounded-xl bg-white border border-[#E8E2DA] flex flex-col gap-2.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#696159]">
                          Quick App Pay
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setVpaId('ananya@okhdfcbank');
                              setVpaVerified(true);
                            }}
                            className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#f6ece7] border border-[#E8E2DA] transition-colors gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[#932616]">smartphone</span>
                            <span className="text-xs font-semibold text-[#1f1b18]">Google Pay</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setVpaId('ananya@ybl');
                              setVpaVerified(true);
                            }}
                            className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#f6ece7] border border-[#E8E2DA] transition-colors gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[#8d4f00]">account_balance_wallet</span>
                            <span className="text-xs font-semibold text-[#1f1b18]">PhonePe</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setVpaId('ananya@paytm');
                              setVpaVerified(true);
                            }}
                            className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#f6ece7] border border-[#E8E2DA] transition-colors gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[#005c15]">qr_code_2</span>
                            <span className="text-xs font-semibold text-[#1f1b18]">Paytm UPI</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setVpaId('ananya@upi');
                              setVpaVerified(true);
                            }}
                            className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#f6ece7] border border-[#E8E2DA] transition-colors gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[#1f1b18]">assured_workload</span>
                            <span className="text-xs font-semibold text-[#1f1b18]">BHIM UPI</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-px bg-[#E8E2DA] flex-1"></div>
                        <span className="text-[11px] font-bold text-[#696159] uppercase tracking-wider">
                          Or Enter Virtual Payment ID (VPA)
                        </span>
                        <div className="h-px bg-[#E8E2DA] flex-1"></div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={vpaId}
                          onChange={e => setVpaId(e.target.value)}
                          placeholder="e.g. mobileNumber@okaxis or name@okhdfcbank"
                          className="flex-1 h-11 px-3.5 bg-white border border-[#E8E2DA] rounded-lg text-xs text-[#1f1b18] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyUpi}
                          className="h-11 px-5 rounded-lg bg-[#eae1db] hover:bg-[#e1d8d3] text-xs font-bold text-[#1f1b18] transition-colors shrink-0 cursor-pointer"
                        >
                          Verify ID
                        </button>
                      </div>

                      <p
                        className={`text-xs flex items-center gap-1 ${
                          vpaVerified ? 'text-[#005c15]' : 'text-[#ba1a1a]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {vpaVerified ? 'verified_user' : 'error'}
                        </span>
                        <span>{vpaMessage}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* OPTION B: Credit & Debit Cards */}
                <div
                  className={`rounded-xl overflow-hidden border transition-all ${
                    paymentMethod === 'cards'
                      ? 'bg-[#FAF8F5] border-[#932616]/60 shadow-xs'
                      : 'bg-white border-[#E8E2DA]'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('cards')}
                    className="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="checkout_payment"
                        checked={paymentMethod === 'cards'}
                        onChange={() => setPaymentMethod('cards')}
                        className="w-4 h-4 accent-[#932616]"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1f1b18]">
                          Credit / Debit / ATM Cards
                        </span>
                        <span className="text-xs text-[#696159]">
                          Visa, MasterCard, RuPay, Maestro & Diners Club
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-80">
                      <span className="font-bold text-[11px] bg-white border border-[#E8E2DA] px-2 py-0.5 rounded">
                        VISA
                      </span>
                      <span className="font-bold text-[11px] bg-white border border-[#E8E2DA] px-2 py-0.5 rounded">
                        MC
                      </span>
                      <span className="font-bold text-[11px] bg-white border border-[#E8E2DA] px-2 py-0.5 rounded">
                        RuPay
                      </span>
                    </div>
                  </label>

                  {paymentMethod === 'cards' && (
                    <div className="px-5 pb-5 pt-1 flex flex-col gap-3.5 border-t border-[#E8E2DA]/60">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#696159] uppercase tracking-wider">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            placeholder="4111 2222 3333 4444"
                            className="w-full h-11 pl-3.5 pr-10 bg-white border border-[#E8E2DA] rounded-lg text-xs text-[#1f1b18] focus:outline-none"
                          />
                          <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#696159] text-base">
                            credit_card
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-[#696159] uppercase tracking-wider">
                            Valid Thru
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={e => setCardExpiry(e.target.value)}
                            placeholder="MM / YY"
                            className="w-full h-11 px-3.5 bg-white border border-[#E8E2DA] rounded-lg text-xs text-[#1f1b18] focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-[#696159] uppercase tracking-wider">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value)}
                            placeholder="3 digits"
                            className="w-full h-11 px-3.5 bg-white border border-[#E8E2DA] rounded-lg text-xs text-[#1f1b18] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#696159] uppercase tracking-wider">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={e => setCardName(e.target.value)}
                          placeholder="Full name as printed on card"
                          className="w-full h-11 px-3.5 bg-white border border-[#E8E2DA] rounded-lg text-xs text-[#1f1b18] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* OPTION C: Net Banking */}
                <div
                  className={`rounded-xl overflow-hidden border transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'bg-[#FAF8F5] border-[#932616]/60 shadow-xs'
                      : 'bg-white border-[#E8E2DA]'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('netbanking')}
                    className="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="checkout_payment"
                        checked={paymentMethod === 'netbanking'}
                        onChange={() => setPaymentMethod('netbanking')}
                        className="w-4 h-4 accent-[#932616]"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1f1b18]">
                          Net Banking
                        </span>
                        <span className="text-xs text-[#696159]">
                          All major Indian Public & Private banks supported
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#696159] text-lg">
                      account_balance
                    </span>
                  </label>

                  {paymentMethod === 'netbanking' && (
                    <div className="px-5 pb-5 pt-1 flex flex-col gap-3 border-t border-[#E8E2DA]/60">
                      <span className="text-[11px] font-bold text-[#696159] uppercase tracking-wider">
                        Popular Banks
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                        {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak'].map(b => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setSelectedBank(b.toLowerCase())}
                            className={`p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              selectedBank === b.toLowerCase()
                                ? 'bg-[#932616] text-white border-[#932616]'
                                : 'bg-white border-[#E8E2DA] text-[#1f1b18] hover:bg-[#fbf2ec]'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>

                      <select
                        value={selectedBank}
                        onChange={e => setSelectedBank(e.target.value)}
                        className="w-full h-11 px-3.5 bg-white border border-[#E8E2DA] rounded-lg text-xs text-[#1f1b18] focus:outline-none"
                      >
                        <option value="hdfc">HDFC Bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="pnb">Punjab National Bank</option>
                        <option value="bob">Bank of Baroda</option>
                        <option value="canara">Canara Bank</option>
                        <option value="indusind">IndusInd Bank</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* OPTION D: Cash on Delivery (COD) */}
                <div
                  className={`rounded-xl overflow-hidden border transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-[#FAF8F5] border-[#932616]/60 shadow-xs'
                      : 'bg-white border-[#E8E2DA]'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="checkout_payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 accent-[#932616]"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#1f1b18]">
                            Cash on Delivery (COD)
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#f0e6e1] text-[#58413d] text-[10px] font-bold">
                            Standard
                          </span>
                        </div>
                        <span className="text-xs text-[#696159]">
                          Pay in cash or scan delivery agent QR code at your doorstep
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#696159] text-lg">
                      payments
                    </span>
                  </label>

                  {paymentMethod === 'cod' && (
                    <div className="px-5 pb-5 pt-1 flex flex-col gap-2 border-t border-[#E8E2DA]/60">
                      <div className="p-3 rounded-lg bg-white border border-[#E8E2DA] text-xs flex items-center justify-between">
                        <span className="text-[#696159]">Cash Handling Convenience Charge</span>
                        <span className="font-bold text-[#005c15]">FREE (Subtotal &gt; ₹699)</span>
                      </div>
                      <p className="text-[11px] text-[#696159]">
                        An OTP verification SMS will be sent to {currentUser?.phone || '+91 98452 77120'} during delivery dispatch.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* PRIMARY ACTION BUTTON */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing || cartItems.length === 0}
                  onClick={handlePayAndPlaceOrder}
                  className="w-full h-14 py-3.5 px-6 rounded-xl bg-[#932616] hover:bg-[#b43e2b] disabled:opacity-50 text-white font-serif text-lg font-bold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">lock</span>
                  <span>
                    {isProcessing
                      ? 'PROCESSING PAYMENT...'
                      : `PAY ₹${grandTotal.toFixed(2)} & PLACE ORDER`}
                  </span>
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>

                <p className="text-center text-xs text-[#696159] flex items-center justify-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-[#005c15] text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  By confirming, you agree to Miras Heritage's Fresh Batch Fulfillment Terms.
                </p>
              </div>

              {/* Security & RBI Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E2DA]">
                  <span className="material-symbols-outlined text-[#8d4f00] text-xl">shield</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#1f1b18]">PCI-DSS Compliant</span>
                    <span className="text-[10px] text-[#696159]">Bank-grade vaulting</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E2DA]">
                  <span className="material-symbols-outlined text-[#932616] text-xl">verified_user</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#1f1b18]">RBI 3D SafeKey</span>
                    <span className="text-[10px] text-[#696159]">Mandatory 2FA protocol</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E2DA]">
                  <span className="material-symbols-outlined text-[#005c15] text-xl">replay</span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#1f1b18]">100% Refund Promise</span>
                    <span className="text-[10px] text-[#696159]">Zero-risk transit damage</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary & Heritage Guarantee (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-36">
            <div className="bg-white rounded-xl shadow-sm border border-[#E8E2DA] p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E2DA]">
                <h2 className="font-serif text-lg font-bold text-[#1f1b18]">Order Summary</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ffdcc0] text-[#8d4f00] text-[11px] font-bold">
                  {cartItems.length} Artisan Items
                </span>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3.5 py-1">
                    <div className="w-16 h-16 rounded-lg bg-[#f6ece7] overflow-hidden shrink-0 relative border border-[#E8E2DA]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 w-3 h-3 border border-[#2E7D32] bg-white flex items-center justify-center p-0.5 rounded-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-xs font-bold text-[#1f1b18] truncate">
                          {product.name}
                        </h3>
                        <span className="text-xs font-bold text-[#1f1b18] shrink-0">
                          ₹{(product.price * quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#696159] mt-0.5">
                        Pack: {product.weight}
                      </p>
                      <span className="text-[11px] text-[#8d4f00] font-semibold">
                        Qty: {quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Applied Badge */}
              {appliedCoupon && (
                <div className="p-3 rounded-lg bg-[#fbf2ec] border border-[#ffdcc0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#932616] text-base">loyalty</span>
                    <span className="text-xs font-bold text-[#932616] tracking-wider">
                      {appliedCoupon.code} Applied
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[11px] text-[#696159] hover:text-[#ba1a1a] transition-colors uppercase font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Ledger Breakdown */}
              <div className="flex flex-col gap-2 pt-1 text-xs text-[#58413d]">
                <div className="flex items-center justify-between">
                  <span className="text-[#696159]">Subtotal ({cartItems.length} Items)</span>
                  <span className="font-semibold text-[#1f1b18]">₹{itemsSubtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[#005c15] font-semibold">
                    <span>Coupon Discount (10%)</span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[#696159]">Express Heritage Dispatch</span>
                  <span className="text-[#005c15] font-bold">FREE</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#696159]">Artisanal Eco-Packaging & Insulation</span>
                  <span className="text-[#005c15] font-bold">FREE</span>
                </div>

                <div className="h-px bg-[#E8E2DA] my-1"></div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="font-serif text-base font-bold text-[#1f1b18]">
                      Total Payable
                    </span>
                    <span className="block text-[10px] text-[#696159]">
                      Inclusive of all native culinary taxes
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-xl font-bold text-[#932616]">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                    <span className="block text-[11px] text-[#005c15] font-semibold">
                      You saved ₹{(couponDiscount + 75).toFixed(2)} today
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Heritage Assurance Card */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E8E2DA] flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ffdcc0]/50 flex items-center justify-center text-[#8d4f00] shrink-0">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1f1b18]">The Miras Purity Guarantee</h4>
                  <p className="text-[11px] text-[#696159]">
                    Native geo-origins, small micro-batches, zero synthetic chemicals.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F5] flex flex-col gap-1 border border-[#E8E2DA]">
                <span className="text-[10px] font-bold text-[#696159] uppercase tracking-wider">
                  Need checkout assistance?
                </span>
                <div className="flex items-center justify-between text-xs text-[#1f1b18]">
                  <a
                    href="tel:+919845012345"
                    className="hover:text-[#932616] flex items-center gap-1 font-semibold"
                  >
                    <span className="material-symbols-outlined text-sm text-[#932616]">call</span>
                    +91 98450 12345
                  </a>
                  <span className="text-[#696159]">•</span>
                  <a
                    href="https://wa.me/919845012345"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#932616] flex items-center gap-1 font-semibold text-[#005c15]"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    WhatsApp Concierge
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E2DA]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-[#1f1b18]">Add Delivery Address</h3>
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="text-[#696159] hover:text-[#1f1b18]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddNewAddress} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#696159] uppercase">Address Tag</label>
                  <input
                    type="text"
                    value={newAddrTitle}
                    onChange={e => setNewAddrTitle(e.target.value)}
                    placeholder="e.g. Home, Office, Parents"
                    required
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#696159] uppercase">PIN Code</label>
                  <input
                    type="text"
                    value={newAddrPin}
                    onChange={e => setNewAddrPin(e.target.value)}
                    placeholder="6 digits"
                    required
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#696159] uppercase">Recipient Name</label>
                  <input
                    type="text"
                    value={newAddrRecipient}
                    onChange={e => setNewAddrRecipient(e.target.value)}
                    required
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#696159] uppercase">Mobile Number</label>
                  <input
                    type="text"
                    value={newAddrPhone}
                    onChange={e => setNewAddrPhone(e.target.value)}
                    required
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#696159] uppercase">Street Address / House No.</label>
                <textarea
                  value={newAddrStreet}
                  onChange={e => setNewAddrStreet(e.target.value)}
                  placeholder="House/Flat No, Apartment, Road, Landmark"
                  required
                  rows={2}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#696159] uppercase">City</label>
                  <input
                    type="text"
                    value={newAddrCity}
                    onChange={e => setNewAddrCity(e.target.value)}
                    required
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#696159] uppercase">State</label>
                  <input
                    type="text"
                    value={newAddrState}
                    onChange={e => setNewAddrState(e.target.value)}
                    required
                    className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#E8E2DA] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#696159] hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#932616] text-white text-xs font-bold rounded-lg hover:bg-[#b43e2b]"
                >
                  Save & Use Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
