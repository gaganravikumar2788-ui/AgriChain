import { cleanIndianMobile } from '../utils/indianVerification';

const USERS_STORAGE_KEY = 'agrichain_registered_users';
const FARMERS_STORAGE_KEY = 'agrichain_registered_farmers';
const BROADCAST_KEY = 'agrichain_auth_sync';

export function getRoleLabel(role = '') {
  const r = (role || '').toUpperCase();
  if (r === 'FARMER') return 'Farmer';
  if (r === 'BUYER' || r === 'BULK_BUYER') return 'Bulk Buyer';
  if (r === 'CONSUMER') return 'Consumer';
  return role;
}

export function getRedirectPath(role = '') {
  const r = (role || '').toUpperCase();
  if (r === 'FARMER') return '/farmer-dashboard';
  if (r === 'BUYER' || r === 'BULK_BUYER') return '/buyer-dashboard';
  if (r === 'CONSUMER') return '/consumer';
  return '/';
}

// Clean and normalize mobile to 10 standard digits
export function normalizeMobileDigits(raw = '') {
  if (!raw) return '';
  return cleanIndianMobile(String(raw));
}

// Read all known users from localStorage & farmer caches
export function getLocalUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    let users = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(users)) users = [];

    // Also pull from registered farmers cache to guarantee all farmers are recognized
    try {
      const rawFarmers = localStorage.getItem(FARMERS_STORAGE_KEY);
      if (rawFarmers) {
        const farmers = JSON.parse(rawFarmers);
        if (Array.isArray(farmers)) {
          farmers.forEach(f => {
            const clean = normalizeMobileDigits(f.phone || f.mobile);
            if (clean && !users.some(u => normalizeMobileDigits(u.mobile || u.phone) === clean)) {
              users.push({
                id: f.id,
                role: 'FARMER',
                name: f.name,
                mobile: f.phone || f.mobile,
                cleanMobile: clean,
                district: f.district,
                registeredAt: f.registeredAt
              });
            }
          });
        }
      }
    } catch (e) {}

    // Also check current active user session
    try {
      const rawSession = localStorage.getItem('agrichain_user');
      if (rawSession) {
        const sessionUser = JSON.parse(rawSession);
        const clean = normalizeMobileDigits(sessionUser.mobile || sessionUser.phone);
        if (clean && !users.some(u => normalizeMobileDigits(u.mobile || u.phone) === clean)) {
          users.push({
            ...sessionUser,
            cleanMobile: clean
          });
        }
      }
    } catch (e) {}

    return users;
  } catch (err) {
    console.warn("Failed to get local users:", err);
    return [];
  }
}

// Fetch users from server sync API (ports 5173 or 5174)
export async function fetchRemoteUsers() {
  const endpoints = ['/api/users', 'http://localhost:5173/api/users', 'http://localhost:5174/api/users'];
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep);
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          return list;
        }
      }
    } catch (e) {}
  }

  // Fallback: check /api/farmers to ensure registered farmers are merged
  const farmerEndpoints = ['/api/farmers', 'http://localhost:5173/api/farmers', 'http://localhost:5174/api/farmers'];
  for (const ep of farmerEndpoints) {
    try {
      const res = await fetch(ep);
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) {
          return list.map(f => ({
            id: f.id,
            role: 'FARMER',
            name: f.name,
            mobile: f.phone || f.mobile,
            cleanMobile: normalizeMobileDigits(f.phone || f.mobile),
            district: f.district,
            registeredAt: f.registeredAt
          }));
        }
      }
    } catch (e) {}
  }
  return [];
}

// Locate any existing registered user across local & remote sources
export async function findExistingUser(rawMobile = '', rawName = '') {
  const cleanPhone = normalizeMobileDigits(rawMobile);
  const cleanName = (rawName || '').trim().toLowerCase();

  // 1. Check local users first
  const localList = getLocalUsers();
  let match = localList.find(u => {
    const uPhone = normalizeMobileDigits(u.mobile || u.phone);
    if (cleanPhone && uPhone && uPhone === cleanPhone) return true;
    if (cleanName && cleanPhone && u.name && u.name.trim().toLowerCase() === cleanName && uPhone === cleanPhone) return true;
    return false;
  });

  if (match) return match;

  // 2. Query server sync API
  try {
    const remoteList = await fetchRemoteUsers();
    match = remoteList.find(u => {
      const uPhone = normalizeMobileDigits(u.mobile || u.phone);
      if (cleanPhone && uPhone && uPhone === cleanPhone) return true;
      if (cleanName && cleanPhone && u.name && u.name.trim().toLowerCase() === cleanName && uPhone === cleanPhone) return true;
      return false;
    });
    if (match) {
      // Cache locally
      saveUserToLocalStorage(match);
      return match;
    }
  } catch (e) {}

  return null;
}

// Validates whether a user can register for the target role
export async function checkRegistrationEligibility(targetRole, rawMobile, rawName) {
  const cleanPhone = normalizeMobileDigits(rawMobile);
  if (!cleanPhone || cleanPhone.length < 10) {
    return {
      allowed: false,
      status: 'INVALID_PHONE',
      message: 'Please provide a valid 10-digit Indian Mobile Number (+91).'
    };
  }

  const existing = await findExistingUser(rawMobile, rawName);

  if (!existing) {
    return {
      allowed: true,
      status: 'NEW_REGISTRATION',
      message: 'Mobile number available for registration.'
    };
  }

  const existingRole = (existing.role || '').toUpperCase();
  const normalizedTargetRole = (targetRole || '').toUpperCase();

  const isSameRole = 
    existingRole === normalizedTargetRole ||
    ((existingRole === 'BUYER' || existingRole === 'BULK_BUYER') && (normalizedTargetRole === 'BUYER' || normalizedTargetRole === 'BULK_BUYER'));

  if (isSameRole) {
    return {
      allowed: true,
      isExisting: true,
      status: 'SAME_ROLE_RETURN',
      existingUser: existing,
      message: `Welcome back, ${existing.name}! You already have an active ${getRoleLabel(existingRole)} account with mobile ${existing.mobile || rawMobile}. Logging you into your account...`,
      redirectPath: getRedirectPath(existingRole)
    };
  }

  // Role Conflict: A farmer cannot register as bulk buyer or consumer, and vice-versa
  return {
    allowed: false,
    isExisting: true,
    status: 'ROLE_CONFLICT',
    existingUser: existing,
    message: `⚠️ Registration Blocked: Mobile number ${existing.mobile || rawMobile} is already registered as a ${getRoleLabel(existingRole)} (${existing.name}) on AgriChain. An account cannot be registered for multiple roles.\n\nRedirecting you to your ${getRoleLabel(existingRole)} Dashboard...`,
    redirectPath: getRedirectPath(existingRole)
  };
}

function saveUserToLocalStorage(userRecord) {
  try {
    const list = getLocalUsers();
    const clean = normalizeMobileDigits(userRecord.mobile || userRecord.phone);
    const existingIdx = list.findIndex(u => normalizeMobileDigits(u.mobile || u.phone) === clean);
    
    let updated;
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = { ...updated[existingIdx], ...userRecord, cleanMobile: clean };
    } else {
      updated = [{ ...userRecord, cleanMobile: clean }, ...list];
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
}

// Save or activate user registration across storage, session, and server
export async function persistUserRegistration(userRecord) {
  const clean = normalizeMobileDigits(userRecord.mobile || userRecord.phone);
  const normalized = {
    ...userRecord,
    cleanMobile: clean,
    registeredAt: userRecord.registeredAt || new Date().toISOString()
  };

  // 1. Update localStorage
  saveUserToLocalStorage(normalized);

  // 2. Set active session user
  localStorage.setItem('agrichain_user', JSON.stringify(normalized));
  if (normalized.role === 'FARMER') {
    localStorage.setItem('farmerName', normalized.name);
    localStorage.setItem('farmerMobile', normalized.mobile);
  } else if (normalized.role === 'BUYER' || normalized.role === 'BULK_BUYER') {
    localStorage.setItem('buyerName', normalized.name);
    localStorage.setItem('buyerMobile', normalized.mobile);
  } else if (normalized.role === 'CONSUMER') {
    localStorage.setItem('consumerName', normalized.name);
    localStorage.setItem('consumerMobile', normalized.mobile);
  }

  // 3. Post to server sync endpoint
  const endpoints = ['/api/users', 'http://localhost:5173/api/users', 'http://localhost:5174/api/users'];
  for (const ep of endpoints) {
    try {
      await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized)
      });
    } catch (e) {}
  }

  // 4. Dispatch events
  window.dispatchEvent(new CustomEvent('agrichain_user_updated', { detail: normalized }));
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const channel = new BroadcastChannel(BROADCAST_KEY);
      channel.postMessage({ type: 'USER_REGISTERED', user: normalized });
      channel.close();
    } catch (e) {}
  }

  return normalized;
}
