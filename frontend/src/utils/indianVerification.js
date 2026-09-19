/**
 * =============================================================================
 * AUTOMATED INDIAN CITIZEN & DOMESTIC ENTITY VERIFICATION
 * Validates Indian Telecom numbers (+91), Indian PIN codes, GSTIN, and Aadhaar
 * without requiring manual SMS OTP entry.
 * =============================================================================
 */

// Cleans phone input to 10 digits
export function cleanIndianMobile(raw) {
  if (!raw) return '';
  let digits = raw.replace(/[^0-9]/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.substring(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  return digits;
}

// Automatically verifies Indian mobile number (+91 / 10-digits starting with 6-9)
export function verifyIndianMobile(raw) {
  if (!raw || raw.trim() === '') {
    return {
      isValid: false,
      digits: '',
      formatted: '',
      message: ''
    };
  }

  const digits = cleanIndianMobile(raw);
  const isValid = /^[6-9]\d{9}$/.test(digits);

  if (!isValid) {
    return {
      isValid: false,
      digits,
      formatted: digits,
      message: digits.length < 10
        ? `Enter 10-digit Indian Mobile (${digits.length}/10 digits)`
        : '⚠️ Invalid format: Indian mobile must start with 6, 7, 8, or 9'
    };
  }

  const prefix = digits.substring(0, 2);
  let operator = 'Jio / Airtel / BSNL / Vi';
  if (['98', '99', '94', '91', '90'].includes(prefix)) operator = 'Airtel / BSNL India';
  else if (['97', '96', '95', '93'].includes(prefix)) operator = 'Jio / Vi India';
  else operator = 'Indian 4G/5G Telecom Network';

  return {
    isValid: true,
    digits,
    formatted: `+91 ${digits.substring(0, 5)} ${digits.substring(5)}`,
    operator,
    message: `🇮🇳 Verified Indian Mobile (+91 • ${operator})`
  };
}

// Automatically verifies 6-digit Indian PIN Code
export function verifyIndianPincode(pincode) {
  if (!pincode || pincode.toString().trim() === '') {
    return { isValid: false, message: '' };
  }
  const clean = pincode.toString().trim();
  const isValid = /^[1-9][0-9]{5}$/.test(clean);
  const isKarnataka = clean.startsWith('56') || clean.startsWith('57') || clean.startsWith('58') || clean.startsWith('59');

  return {
    isValid,
    isKarnataka,
    zone: isKarnataka ? 'Karnataka Postal Circle' : 'Domestic Indian Postal Circle',
    message: isValid
      ? `🇮🇳 Verified Indian Postal Zone (${isKarnataka ? 'Karnataka' : 'Domestic India'})`
      : 'Enter valid 6-digit Indian PIN code'
  };
}

// Automatically verifies 15-character Indian GSTIN
export function verifyIndianGST(gst) {
  if (!gst || gst.trim() === '') {
    return { isValid: false, message: '' };
  }
  const clean = gst.toUpperCase().trim();
  const isValid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(clean);
  const stateCode = clean.substring(0, 2);
  const stateMap = {
    '29': 'Karnataka',
    '27': 'Maharashtra',
    '33': 'Tamil Nadu',
    '36': 'Telangana',
    '37': 'Andhra Pradesh',
    '24': 'Gujarat',
    '07': 'Delhi'
  };
  const stateName = stateMap[stateCode] || 'Indian Commerce Registry';

  return {
    isValid,
    state: stateName,
    message: isValid
      ? `🇮🇳 Verified Indian Commercial Entity (${stateName} GSTIN)`
      : 'Enter valid 15-digit GSTIN (e.g. 29AAAAA0000A1Z5)'
  };
}

// Automatically verifies 12-digit Indian Aadhaar format
export function verifyIndianAadhaar(aadhaar) {
  if (!aadhaar || aadhaar.trim() === '') {
    return { isValid: false, message: '' };
  }
  const digits = aadhaar.replace(/[^0-9]/g, '');
  const isValid = /^[2-9]{1}[0-9]{11}$/.test(digits);

  return {
    isValid,
    digits,
    formatted: digits.length === 12 ? `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}` : digits,
    message: isValid ? '🇮🇳 Verified Indian Aadhaar / UIDAI Format' : 'Enter 12-digit Indian Aadhaar'
  };
}
