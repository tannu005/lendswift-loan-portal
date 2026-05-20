import { PAN_ENTITY_TYPES, VALID_PAN_TYPES } from './constants';

/**
 * Validate PAN format: AAAAA9999A
 * Position 1-5: Uppercase letters
 * Position 6-9: Digits
 * Position 10: Uppercase letter
 * Position 4: Entity type indicator
 */
export function validatePAN(pan, loanType = 'personal') {
  if (!pan || typeof pan !== 'string') return { valid: false, error: 'PAN is required' };
  
  const cleaned = pan.toUpperCase().trim();
  
  if (cleaned.length !== 10) {
    return { valid: false, error: 'PAN must be exactly 10 characters' };
  }
  
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  if (!panRegex.test(cleaned)) {
    return { valid: false, error: 'PAN must be in format AAAAA9999A (5 letters, 4 digits, 1 letter)' };
  }
  
  const entityChar = cleaned[3];
  if (!PAN_ENTITY_TYPES[entityChar]) {
    return { 
      valid: false, 
      error: `PAN 4th character '${entityChar}' is not a valid entity type. Valid types: ${Object.entries(PAN_ENTITY_TYPES).map(([k, v]) => `${k} (${v})`).join(', ')}` 
    };
  }
  
  const validTypes = VALID_PAN_TYPES[loanType] || ['P'];
  if (!validTypes.includes(entityChar)) {
    return {
      valid: false,
      error: `PAN entity type '${entityChar}' (${PAN_ENTITY_TYPES[entityChar]}) is not valid for ${loanType} loans. Accepted: ${validTypes.map(t => `${t} (${PAN_ENTITY_TYPES[t]})`).join(', ')}`
    };
  }
  
  return { valid: true, error: null, entityType: PAN_ENTITY_TYPES[entityChar] };
}

/**
 * Verhoeff checksum algorithm for Aadhaar validation
 */
const verhoeffD = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const verhoeffP = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];



export function verhoeffChecksum(num) {
  let c = 0;
  const digits = num.toString().split('').reverse().map(Number);
  for (let i = 0; i < digits.length; i++) {
    c = verhoeffD[c][verhoeffP[i % 8][digits[i]]];
  }
  return c === 0;
}

/**
 * Validate Aadhaar number: 12 digits with Verhoeff checksum
 */
export function validateAadhaar(aadhaar) {
  if (!aadhaar || typeof aadhaar !== 'string') return { valid: false, error: 'Aadhaar number is required' };
  
  const cleaned = aadhaar.replace(/\s/g, '');
  
  if (cleaned.length !== 12) {
    return { valid: false, error: 'Aadhaar must be exactly 12 digits' };
  }
  
  if (!/^\d{12}$/.test(cleaned)) {
    return { valid: false, error: 'Aadhaar must contain only digits' };
  }
  
  if (cleaned[0] === '0' || cleaned[0] === '1') {
    return { valid: false, error: 'Aadhaar cannot start with 0 or 1' };
  }
  
  if (!verhoeffChecksum(cleaned)) {
    return { valid: false, error: 'Invalid Aadhaar number (checksum failed)' };
  }
  
  return { valid: true, error: null };
}

/**
 * Validate GST number: 15-character format
 * First 2: State code (01-37)
 * Next 10: PAN
 * 13th: Entity number (1-9, A-Z)
 * 14th: Z (default)
 * 15th: Checksum
 */
export function validateGST(gst) {
  if (!gst || typeof gst !== 'string') return { valid: false, error: 'GST number is required' };
  
  const cleaned = gst.toUpperCase().trim();
  
  if (cleaned.length !== 15) {
    return { valid: false, error: 'GST number must be exactly 15 characters' };
  }
  
  const gstRegex = /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  if (!gstRegex.test(cleaned)) {
    return { valid: false, error: 'Invalid GST format. Expected: State code (2 digits) + PAN (10 chars) + Entity (1 char) + Z + Checksum (1 char)' };
  }
  
  const stateCode = parseInt(cleaned.substring(0, 2));
  if (stateCode < 1 || stateCode > 37) {
    return { valid: false, error: 'Invalid state code in GST number' };
  }
  
  return { valid: true, error: null };
}

/**
 * Validate Voter ID: 3 letters + 7 digits
 */
export function validateVoterID(voterId) {
  if (!voterId) return { valid: true, error: null }; // Optional
  const cleaned = voterId.toUpperCase().trim();
  const regex = /^[A-Z]{3}\d{7}$/;
  if (!regex.test(cleaned)) {
    return { valid: false, error: 'Voter ID must be 3 letters followed by 7 digits' };
  }
  return { valid: true, error: null };
}

/**
 * Validate Passport: 1 letter + 7 digits
 */
export function validatePassport(passport) {
  if (!passport) return { valid: true, error: null }; // Optional
  const cleaned = passport.toUpperCase().trim();
  const regex = /^[A-Z]\d{7}$/;
  if (!regex.test(cleaned)) {
    return { valid: false, error: 'Passport must be 1 letter followed by 7 digits' };
  }
  return { valid: true, error: null };
}

/**
 * Validate Indian mobile number: 10 digits starting with 6-9
 */
export function validateMobile(mobile) {
  if (!mobile) return { valid: false, error: 'Mobile number is required' };
  const cleaned = mobile.replace(/\s/g, '');
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return { valid: false, error: 'Mobile must be 10 digits starting with 6, 7, 8, or 9' };
  }
  return { valid: true, error: null };
}

/**
 * Validate email
 */
export function validateEmail(email) {
  if (!email) return { valid: false, error: 'Email is required' };
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true, error: null };
}

/**
 * Validate Indian PIN code
 */
export function validatePinCode(pin) {
  if (!pin) return { valid: false, error: 'PIN code is required' };
  const cleaned = pin.toString().trim();
  if (!/^\d{6}$/.test(cleaned)) {
    return { valid: false, error: 'PIN code must be exactly 6 digits' };
  }
  if (cleaned[0] === '0') {
    return { valid: false, error: 'PIN code cannot start with 0' };
  }
  return { valid: true, error: null };
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dob) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Format number in Indian number system (e.g., 10,50,000)
 */
export function formatIndianCurrency(num) {
  if (num === undefined || num === null || isNaN(num)) return '₹0';
  const numStr = Math.round(Number(num)).toString();
  let result;
  const len = numStr.length;
  
  if (len <= 3) {
    result = numStr;
  } else {
    result = numStr.substring(len - 3);
    let remaining = numStr.substring(0, len - 3);
    while (remaining.length > 2) {
      result = remaining.substring(remaining.length - 2) + ',' + result;
      remaining = remaining.substring(0, remaining.length - 2);
    }
    if (remaining.length > 0) {
      result = remaining + ',' + result;
    }
  }
  
  return '₹' + result;
}

/**
 * Parse Indian currency string to number
 */
export function parseIndianCurrency(str) {
  if (!str) return 0;
  return parseInt(str.toString().replace(/[₹,\s]/g, ''), 10) || 0;
}
