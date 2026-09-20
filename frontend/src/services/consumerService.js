// AgriChain Consumer Service (Cart & Godown Fulfillment Engine)

const CART_KEY = 'agrichain_consumer_cart';
const CONSUMER_ORDERS_KEY = 'agrichain_consumer_orders';
const BUYER_ORDERS_KEY = 'agrichain_buyer_orders';
const BROADCAST_KEY = 'agrichain_buyer_sync';

// Get Cart Items
export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read consumer cart:", e);
    return [];
  }
}

// Save Cart Items
export function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('agrichain_cart_updated', { detail: items }));
    return items;
  } catch (e) {
    console.error("Failed to save consumer cart:", e);
    return [];
  }
}

// Add or increment item in Cart
export function addToCart(product) {
  const current = getCart();
  const existingIdx = current.findIndex(item => item.id === product.id);

  let updated;
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx].qty += 1;
  } else {
    updated = [...current, { ...product, qty: 1 }];
  }

  saveCart(updated);
  return updated;
}

// Decrement or remove item from Cart
export function removeFromCart(productId) {
  const current = getCart();
  const existingIdx = current.findIndex(item => item.id === productId);

  if (existingIdx < 0) return current;

  let updated = [...current];
  if (updated[existingIdx].qty > 1) {
    updated[existingIdx].qty -= 1;
  } else {
    updated = updated.filter(item => item.id !== productId);
  }

  saveCart(updated);
  return updated;
}

// Clear Cart
export function clearCart() {
  saveCart([]);
}

// Subscribe to Cart updates
export function subscribeCart(callback) {
  callback(getCart());
  const handler = (e) => {
    callback(e.detail || getCart());
  };
  window.addEventListener('agrichain_cart_updated', handler);
  window.addEventListener('storage', () => callback(getCart()));
  return () => {
    window.removeEventListener('agrichain_cart_updated', handler);
  };
}

// Get Consumer Order History
export function getConsumerOrders() {
  try {
    const raw = localStorage.getItem(CONSUMER_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Place Consumer Order & Connect Directly to Bulk Buyer Godown
export async function placeConsumerOrder({ items, address, tip = 0, paymentMode = 'Cash on Delivery' }) {
  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  const storedUser = localStorage.getItem('agrichain_user');
  let parsedUser = {};
  try {
    if (storedUser) parsedUser = JSON.parse(storedUser);
  } catch (e) {}

  const consumerName = parsedUser.name || localStorage.getItem('consumerName') || 'Valued Customer';
  const consumerMobile = parsedUser.mobile || localStorage.getItem('consumerMobile') || '+91 90359 14558';

  const itemTotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = itemTotal >= 199 ? 0 : 25;
  const packagingFee = 4;
  const grandTotal = itemTotal + deliveryFee + packagingFee + tip;
  const orderId = `AGR-QC-${Date.now().toString().slice(-6)}`;

  // 1. Consumer-Facing Order Record (Blinkit Experience)
  const consumerOrder = {
    id: orderId,
    placedAt: new Date().toISOString(),
    consumerName,
    consumerMobile,
    deliveryAddress: address?.name || 'Indiranagar, Bengaluru',
    city: address?.city || 'Bengaluru',
    pincode: address?.pincode || '560038',
    items,
    totalItems: items.reduce((s, i) => s + i.qty, 0),
    itemTotal,
    deliveryFee,
    packagingFee,
    tip,
    grandTotal,
    paymentMode,
    status: 'Order Confirmed',
    etaMinutes: 10,
    // Backend Godown Link (Hidden from Consumer UI)
    backendFulfillment: {
      sourceGodown: 'Ravi Traders AgriChain Hub & Cold Storage',
      godownDistrict: 'Mysuru-Bengaluru Agro Corridor',
      hubRef: address?.hub || 'AgriChain Central Dark Store',
      dispatchedAt: new Date().toISOString()
    }
  };

  // Save to Consumer orders
  const existingConsumerOrders = getConsumerOrders();
  const updatedConsumerOrders = [consumerOrder, ...existingConsumerOrders];
  localStorage.setItem(CONSUMER_ORDERS_KEY, JSON.stringify(updatedConsumerOrders));

  // 2. CONNECT TO BULK BUYER GODOWN IN THE BACKEND
  // Push directly into the Bulk Buyer's active orders ledger (agrichain_buyer_orders)
  try {
    let existingBuyerOrders = [];
    const rawBuyerOrders = localStorage.getItem(BUYER_ORDERS_KEY);
    if (rawBuyerOrders) {
      existingBuyerOrders = JSON.parse(rawBuyerOrders);
    }

    const itemsSummary = items.map(i => `${i.name} (x${i.qty})`).slice(0, 3).join(', ');
    const moreSuffix = items.length > 3 ? ` +${items.length - 3} more items` : '';

    const godownFulfillmentRecord = {
      id: `ORD-WH-${Date.now().toString().slice(-6)}`,
      crop: `${itemsSummary}${moreSuffix}`,
      quantity: `${consumerOrder.totalItems} Consumer Packs`,
      seller: `Customer: ${consumerName} (${consumerOrder.deliveryAddress})`,
      amount: `₹${grandTotal.toLocaleString('en-IN')}`,
      status: 'Dispatched from Godown (10-Min Delivery)',
      date: new Date().toISOString().split('T')[0],
      source: 'AgriChain Quick Commerce',
      consumerOrderId: orderId
    };

    const updatedBuyerOrders = [godownFulfillmentRecord, ...existingBuyerOrders];
    localStorage.setItem(BUYER_ORDERS_KEY, JSON.stringify(updatedBuyerOrders));

    // Broadcast update across open browser tabs
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel(BROADCAST_KEY);
        bc.postMessage({ type: 'NEW_ORDER', order: godownFulfillmentRecord });
        bc.close();
      } catch (err) {}
    }

    window.dispatchEvent(new CustomEvent('agrichain_buyer_order_placed', { detail: godownFulfillmentRecord }));
  } catch (godownErr) {
    console.warn("Backend godown fulfillment sync note:", godownErr);
  }

  // Clear current active cart
  clearCart();

  return consumerOrder;
}
