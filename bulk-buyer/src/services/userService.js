import { cleanIndianMobile } from '../../../frontend/src/utils/indianVerification';

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
  if (r === 'FARMER') return 'http://localhost:5173/farmer-dashboard';
  if (r === 'BUYER' || r === 'BULK_BUYER') return '/';
  if (r === 'CONSUMER') return 'http://localhost:5173/consumer';
  return '/';
}

export function normalizeMobileDigits(raw = '') {
  if (!raw) return '';
  let digits = String(raw).replace(/[^0-9]/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.substring(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  return digits;
}

export function getLocalUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    let users = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(users)) users = [];

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

    return users;
  } catch (err) {
    console.warn("Failed to get local users:", err);
    return [];
  }
}

export async function fetchRemoteUsers() {
  const endpoints = ['/api/users', 'http://localhost:5174/api/users', 'http://localhost:5173/api/users'];
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
  return [];
}

export async function findExistingUser(rawMobile = '', rawName = '') {
  const cleanPhone = normalizeMobileDigits(rawMobile);
  const cleanName = (rawName || '').trim().toLowerCase();

  const localList = getLocalUsers();
  let match = localList.find(u => {
    const uPhone = normalizeMobileDigits(u.mobile || u.phone);
    if (cleanPhone && uPhone && uPhone === cleanPhone) return true;
    if (cleanName && cleanPhone && u.name && u.name.trim().toLowerCase() === cleanName && uPhone === cleanPhone) return true;
    return false;
  });

  if (match) return match;

  try {
    const remoteList = await fetchRemoteUsers();
    match = remoteList.find(u => {
      const uPhone = normalizeMobileDigits(u.mobile || u.phone);
      if (cleanPhone && uPhone && uPhone === cleanPhone) return true;
      if (cleanName && cleanPhone && u.name && u.name.trim().toLowerCase() === cleanName && uPhone === cleanPhone) return true;
      return false;
    });
    return match || null;
  } catch (e) {}

  return null;
}

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

  return {
    allowed: false,
    isExisting: true,
    status: 'ROLE_CONFLICT',
    existingUser: existing,
    message: `⚠️ Registration Blocked: Mobile number ${existing.mobile || rawMobile} is already registered as a ${getRoleLabel(existingRole)} (${existing.name}) on AgriChain. An account cannot be registered for multiple roles.\n\nRedirecting you to your ${getRoleLabel(existingRole)} Dashboard...`,
    redirectPath: getRedirectPath(existingRole)
  };
}
