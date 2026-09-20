import React from 'react';
import { Plus, Minus, Clock, Star, Sparkles } from 'lucide-react';

export default function ProductCard({ product, cartQty = 0, onAdd, onRemove }) {
  return (
    <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-1 mb-2">
        {/* Delivery Time Badge */}
        <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-black">
          <Clock className="w-3 h-3 text-amber-700" />
          <span>{product.deliveryTime || '10 MINS'}</span>
        </div>

        {/* Discount Tag */}
        {product.discount && (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.discount}
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden bg-slate-50 mb-3 flex items-center justify-center p-2">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain object-center transform group-hover:scale-106 transition-transform duration-300"
          loading="lazy"
        />
        {product.tag && (
          <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
            <span>{product.tag}</span>
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Unit / Weight Pill */}
          <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
            {product.unit}
          </span>

          {/* Product Title */}
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-tight mb-1.5 group-hover:text-emerald-800 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.2 rounded text-[10px] font-black text-emerald-800">
              <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
              <span>{product.rating}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">({product.reviews})</span>
          </div>
        </div>

        {/* Bottom Price & Blinkit-Signature ADD / Stepper */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          {/* Price & MRP */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-slate-900">
                ₹{product.price}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-[11px] text-slate-400 line-through font-semibold">
                  ₹{product.mrp}
                </span>
              )}
            </div>
          </div>

          {/* Blinkit Green ADD Button / Counter Stepper */}
          {cartQty === 0 ? (
            <button
              onClick={() => onAdd(product)}
              className="px-4 py-1.5 rounded-xl border-2 border-[#0c831f] text-[#0c831f] bg-emerald-50/50 hover:bg-[#0c831f] hover:text-white font-black text-xs transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center bg-[#0c831f] text-white rounded-xl shadow-xs overflow-hidden">
              <button
                onClick={() => onRemove(product.id)}
                className="w-7 h-7 flex items-center justify-center hover:bg-emerald-800 text-white transition-colors cursor-pointer active:scale-90"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="w-6 text-center font-black text-xs select-none">
                {cartQty}
              </span>
              <button
                onClick={() => onAdd(product)}
                className="w-7 h-7 flex items-center justify-center hover:bg-emerald-800 text-white transition-colors cursor-pointer active:scale-90"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
