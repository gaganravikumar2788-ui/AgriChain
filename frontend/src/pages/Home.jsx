import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, ShoppingCart, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="text-center mb-16 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">AgriChain</span>
        </h1>
        <p className="text-2xl text-emerald-50 font-medium drop-shadow-md">
          Empowering the agricultural ecosystem. Select your role to begin.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Link to="/register/farmer" className="group bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-green-500 flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform">
            <Tractor size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Farmer</h2>
          <p className="text-gray-600 text-center leading-relaxed">
            Register to sell your crops directly to buyers and manage your inventory with ease.
          </p>
        </Link>

        <Link to="/register/buyer" className="group bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-blue-500 flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Bulk Buyer</h2>
          <p className="text-gray-600 text-center leading-relaxed">
            Register with your GST to purchase high-quality produce in large quantities safely.
          </p>
        </Link>

        <Link to="/register/consumer" className="group bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-purple-500 flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform">
            <Users size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Consumer</h2>
          <p className="text-gray-600 text-center leading-relaxed">
            Register to purchase fresh, farm-direct produce for your personal or family use.
          </p>
        </Link>
      </div>
    </div>
  );
}

