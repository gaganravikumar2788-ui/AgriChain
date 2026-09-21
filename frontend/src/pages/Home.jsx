import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, ShoppingCart, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6">
      <div className="text-center mb-8 sm:mb-12 bg-white/10 backdrop-blur-md p-5 sm:p-8 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center">
        <div className="mb-3 sm:mb-4 relative group">
          <img 
            src="/logo.png" 
            alt="AgriChain Logo - Field to Fork Freshness" 
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain rounded-full shadow-2xl bg-white/95 p-1 border-3 sm:border-4 border-emerald-400/80 transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 sm:mb-5 drop-shadow-lg leading-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">AgriChain</span>
        </h1>
        <p className="text-sm sm:text-lg md:text-2xl text-emerald-50 font-medium drop-shadow-md max-w-xl sm:max-w-2xl">
          Empowering the agricultural ecosystem. Select your role to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
        <Link to="/register/farmer" className="group bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border-t-4 border-t-green-500 flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 text-white shadow-lg group-hover:scale-110 transition-transform">
            <Tractor size={34} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Farmer</h2>
          <p className="text-gray-600 text-center leading-relaxed text-xs sm:text-sm">
            Register to sell your crops directly to buyers and manage your inventory with ease.
          </p>
        </Link>

        <Link to="/register/buyer" className="group bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border-t-4 border-t-blue-500 flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 text-white shadow-lg group-hover:scale-110 transition-transform">
            <ShoppingCart size={34} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Bulk Buyer</h2>
          <p className="text-gray-600 text-center leading-relaxed text-xs sm:text-sm">
            Register with your GST to purchase high-quality produce in large quantities safely.
          </p>
        </Link>

        <Link to="/consumer" className="group bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border-t-4 border-t-amber-400 flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mb-4 sm:mb-6 text-slate-900 shadow-lg group-hover:scale-110 transition-transform">
            <Users size={34} />
          </div>
          <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Consumer</h2>
            <span className="bg-[#0c831f] text-white text-[10px] font-black px-2 py-0.5 rounded-full">FARM DIRECT</span>
          </div>
          <p className="text-gray-600 text-center leading-relaxed text-xs sm:text-sm">
            Order farm-fresh vegetables, fruits, dairy, and groceries with direct doorstep delivery.
          </p>
        </Link>
      </div>
    </div>
  );
}

