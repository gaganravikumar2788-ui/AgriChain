import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ShoppingBag, 
  ArrowRight,
  Heart,
  FileText
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onAdd, 
  onRemove, 
  onClear,
  onCheckout, 
  selectedArea 
}) {
  const [tip, setTip] = useState(20);
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isOpen) return null;

  const itemTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const freeDeliveryThreshold = 199;
  const isFreeDelivery = itemTotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : 25;
  const packagingFee = 4;
  const grandTotal = itemTotal + deliveryFee + packagingFee + tip;
  const remainingForFree = Math.max(0, freeDeliveryThreshold - itemTotal);

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    try {
      await onCheckout({
        items: cartItems,
        address: selectedArea,
        tip,
        paymentMode: 'Cash on Delivery / UPI'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" 
      />

      {/* Slide-out Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#f4f6fb] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-[#0c831f] flex items-center justify-center font-black">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 leading-tight">My Cart</h2>
                <p className="text-xs text-slate-500 font-semibold">{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in basket</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Free Delivery Milestone Progress */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Delivery in 10-12 Mins</span>
                </span>
                <span className={isFreeDelivery ? 'text-[#0c831f] font-black' : 'text-slate-500'}>
                  {isFreeDelivery ? '🎉 FREE Delivery Unlocked!' : `Add ₹${remainingForFree} for FREE delivery`}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#0c831f] transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (itemTotal / freeDeliveryThreshold) * 100)}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-base text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Add farm-fresh produce and daily groceries to get 10-minute delivery!</p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-[#0c831f] text-white font-bold text-xs shadow-sm hover:shadow-md cursor-pointer transition-all"
                >
                  Browse Fresh Products
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs divide-y divide-slate-100">
                <div className="pb-3 flex items-center justify-between">
                  <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                    Cart Items
                  </span>
                  <button
                    onClick={onClear}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100 shrink-0" 
                        />
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs text-slate-900 truncate leading-tight">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{item.unit}</span>
                          <span className="text-xs font-black text-slate-900 block mt-0.5">
                            ₹{item.price * item.qty}
                          </span>
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center bg-[#0c831f] text-white rounded-xl shadow-2xs overflow-hidden shrink-0">
                        <button
                          onClick={() => onRemove(item.id)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-emerald-800 text-white transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3 stroke-[3]" />
                        </button>
                        <span className="w-5 text-center font-black text-xs select-none">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onAdd(item)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-emerald-800 text-white transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Address Pill */}
            {cartItems.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-slate-900 truncate">
                      Delivery to {selectedArea?.name || 'Indiranagar, Bengaluru'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Doorstep delivery in 10-12 mins
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Partner Tip */}
            {cartItems.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Tip your delivery partner</span>
                  </span>
                  {tip > 0 && (
                    <button 
                      onClick={() => setTip(0)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {[10, 20, 30, 50].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setTip(amount)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        tip === amount
                          ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bill Details (Blinkit Signature Breakdown) */}
            {cartItems.length > 0 && (
              <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-2 text-xs">
                <div className="font-black text-xs uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Bill Details</span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Items Total</span>
                  <span className="font-bold text-slate-900">₹{itemTotal}</span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Delivery Charge</span>
                  <span>
                    {isFreeDelivery ? (
                      <span className="text-[#0c831f] font-black uppercase tracking-wider">FREE</span>
                    ) : (
                      <span className="font-bold text-slate-900">₹{deliveryFee}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Handling & Packaging Fee</span>
                  <span className="font-bold text-slate-900">₹{packagingFee}</span>
                </div>

                {tip > 0 && (
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Delivery Partner Tip</span>
                    <span className="font-bold text-slate-900">₹{tip}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline font-black text-sm text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-base text-[#0c831f]">₹{grandTotal}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer / Place Order Bar */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 shrink-0 shadow-lg">
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacing}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#0c831f] hover:bg-[#0b741b] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-between cursor-pointer active:scale-98 disabled:opacity-75"
              >
                <div className="text-left">
                  <div className="text-sm font-black">₹{grandTotal}</div>
                  <div className="text-[10px] text-emerald-100 font-semibold uppercase tracking-wider">TOTAL BILL</div>
                </div>

                <div className="flex items-center gap-2">
                  <span>{isPlacing ? "Confirming Order..." : "Place Order (10 Min)"}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pay via Cash on Delivery or UPI on arrival</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
