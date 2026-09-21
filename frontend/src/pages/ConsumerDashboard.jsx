import React, { useState, useEffect, useMemo } from 'react';
import ConsumerHeader from '../components/consumer/ConsumerHeader';
import CategoryPills from '../components/consumer/CategoryPills';
import ProductCard from '../components/consumer/ProductCard';
import CartDrawer from '../components/consumer/CartDrawer';
import LiveDeliveryModal from '../components/consumer/LiveDeliveryModal';
import { CONSUMER_PRODUCTS, DELIVERY_AREAS, CONSUMER_CATEGORIES } from '../data/consumerData';
import { 
  subscribeCart, 
  addToCart, 
  removeFromCart, 
  clearCart, 
  placeConsumerOrder,
  getConsumerOrders 
} from '../services/consumerService';
import { 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Leaf, 
  Truck, 
  Package, 
  ChevronRight, 
  X, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export default function ConsumerDashboard() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState(DELIVERY_AREAS[0]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const [consumerOrders, setConsumerOrders] = useState(() => getConsumerOrders());

  // Real-time cart synchronization
  useEffect(() => {
    const unsubscribe = subscribeCart((items) => {
      setCartItems(items || []);
    });
    return () => unsubscribe();
  }, []);

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return CONSUMER_PRODUCTS.filter(prod => {
      const matchCat = activeCategory === 'all' || prod.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        prod.name.toLowerCase().includes(q) || 
        prod.category.toLowerCase().includes(q) ||
        (prod.tag && prod.tag.toLowerCase().includes(q)) ||
        (prod.description && prod.description.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  // Handle Order Placement & Godown Fulfillment
  const handleCheckout = async (orderPayload) => {
    try {
      const placedOrder = await placeConsumerOrder(orderPayload);
      setConsumerOrders(prev => [placedOrder, ...prev]);
      setIsCartOpen(false);
      setActiveTrackingOrder(placedOrder);
    } catch (err) {
      alert("Order placement failed: " + err.message);
    }
  };

  const getCartItemQty = (prodId) => {
    const found = cartItems.find(item => item.id === prodId);
    return found ? found.qty : 0;
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col font-sans text-slate-800 selection:bg-emerald-500 selection:text-white">
      {/* ── 1. BLINKIT-STYLE HEADER ── */}
      <ConsumerHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
      />

      {/* ── 2. CATEGORY PILLS HORIZONTAL BAR ── */}
      <CategoryPills
        activeCategory={activeCategory}
        onSelectCategory={(catId) => {
          setActiveCategory(catId);
          setSearchQuery('');
        }}
      />

      {/* ── 3. MAIN WORKSPACE CONTAINER ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Top Hero Promotional Banners */}
        {!searchQuery && activeCategory === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Promo Card 1: Farm Morning Harvest */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#0f766e] text-white p-6 sm:p-7 shadow-md flex flex-col justify-between group">
              <div className="relative z-10 max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black mb-3">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Harvested 4:00 AM Today</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
                  Farm-Gate Freshness at Wholesale Rates
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed mb-4">
                  100% direct produce from verified Karnataka farmers. Plucked at dawn, chilled at our local hub, delivered farm-fresh to your door.
                </p>
                <button
                  onClick={() => setActiveCategory('vegetables')}
                  className="px-5 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-black text-xs shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Shop Fresh Vegetables</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Background decorative artwork */}
              <div className="absolute right-0 bottom-0 w-48 h-48 opacity-25 pointer-events-none translate-x-10 translate-y-10">
                <Leaf className="w-full h-full text-white" />
              </div>
            </div>

            {/* Promo Card 2: Fresh Farm Fulfillment */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#f8cb46] via-[#f7be16] to-[#f59e0b] text-slate-950 p-6 sm:p-7 shadow-md flex flex-col justify-between group">
              <div className="relative z-10 max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-black mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Direct Farm Delivery</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
                  Direct Hub & Farm Fulfillment
                </h2>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed mb-4">
                  No minimum order required. Free delivery on baskets above ₹199. Packaged with zero plastic touch and hygienic double-seal.
                </p>
                <button
                  onClick={() => setActiveCategory('dairy')}
                  className="px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Dairy, Milk & Eggs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute right-0 bottom-0 w-48 h-48 opacity-20 pointer-events-none translate-x-8 translate-y-8">
                <Truck className="w-full h-full text-slate-900" />
              </div>
            </div>
          </div>
        )}

        {/* ── 4. CATEGORY HEADING & ACTIVE FILTER SUMMARY ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight capitalize">
                {searchQuery ? `Search Results for "${searchQuery}"` : (
                  CONSUMER_CATEGORIES.find(c => c.id === activeCategory)?.name || 'All Farm Products'
                )}
              </h2>
              <span className="bg-emerald-100 text-[#0c831f] text-xs font-black px-2.5 py-0.5 rounded-full">
                {filteredProducts.length} Items
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Fresh farm-gate delivery dispatched directly to {selectedArea?.name}
            </p>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 self-start sm:self-center flex items-center gap-1 cursor-pointer"
            >
              <span>Clear Search Filter</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ── 5. PRODUCTS GRID ── */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-base text-slate-800">No items match your query</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try searching for tomatoes, potatoes, onions, milk, or ragi.</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-xl bg-[#0c831f] text-white font-black text-xs shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
            {filteredProducts.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                cartQty={getCartItemQty(prod.id)}
                onAdd={(p) => addToCart(p)}
                onRemove={(pId) => removeFromCart(pId)}
              />
            ))}
          </div>
        )}

        {/* ── 6. TRUST & ASSURANCE FOOTER STRIP ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">Direct Doorstep Delivery</h4>
              <p className="text-[11px] text-slate-500 font-medium">Hyperlocal network of distribution hubs</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">100% Quality Guarantee</h4>
              <p className="text-[11px] text-slate-500 font-medium">Instant refund if produce not fresh</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">Direct From Farmers</h4>
              <p className="text-[11px] text-slate-500 font-medium">Fair farm-gate compensation</p>
            </div>
          </div>
        </div>
      </main>

      {/* ── 7. SLIDE-OUT CART DRAWER ── */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onAdd={(p) => addToCart(p)}
        onRemove={(pId) => removeFromCart(pId)}
        onClear={() => clearCart()}
        onCheckout={handleCheckout}
        selectedArea={selectedArea}
      />

      {/* ── 8. LIVE DELIVERY TRACKING MODAL ── */}
      {activeTrackingOrder && (
        <LiveDeliveryModal
          order={activeTrackingOrder}
          onClose={() => setActiveTrackingOrder(null)}
          onContinueShopping={() => setActiveTrackingOrder(null)}
        />
      )}

      {/* ── 9. CONSUMER ORDERS MODAL / DRAWER ── */}
      {isOrdersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 bg-gradient-to-r from-[#0c831f] to-emerald-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5" />
                <h3 className="font-black text-lg">My Orders & Invoices</h3>
              </div>
              <button
                onClick={() => setIsOrdersOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100">
              {consumerOrders.length === 0 ? (
                <div className="text-center py-10">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No previous orders placed yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">Your grocery delivery orders will appear here.</p>
                </div>
              ) : (
                consumerOrders.map(ord => (
                  <div key={ord.id} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-xs text-slate-900">{ord.id}</span>
                        <span className="text-[10px] text-slate-400 block">{new Date(ord.placedAt).toLocaleString()}</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                        {ord.status || 'Delivered'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium">
                      {ord.items?.map(i => `${i.name} (x${i.qty})`).join(', ')}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="font-black text-slate-900">Total: ₹{ord.grandTotal}</span>
                      <button
                        onClick={() => {
                          setIsOrdersOpen(false);
                          setActiveTrackingOrder(ord);
                        }}
                        className="text-[#0c831f] hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Track Delivery</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
