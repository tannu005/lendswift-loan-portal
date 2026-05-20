/**
 * AES-256-GCM encryption/decryption using Web Crypto API
 * For auto-save data protection of PII in localStorage
 */

const PASSPHRASE = 'LendSwift-Draft-Key-2024';
const SALT = new Uint8Array([115, 97, 108, 116, 95, 108, 101, 110, 100, 115, 119, 105, 102, 116, 95, 50]);

/**
 * Derive a key from passphrase using PBKDF2
 */
async function getKey() {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(PASSPHRASE),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a string using AES-256-GCM
 * @param {string} data - Plain text to encrypt
 * @returns {string} Base64-encoded encrypted data with IV prepended
 */
export async function encrypt(data) {
  try {
    const key = await getKey();
    const encoder = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(data)
    );
    
    // Prepend IV to ciphertext
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (err) {
    console.error('Encryption error:', err);
    throw new Error('Failed to encrypt data', { cause: err });
  }
}

/**
 * Decrypt AES-256-GCM encrypted data
 * @param {string} encryptedData - Base64-encoded encrypted data
 * @returns {string} Decrypted plain text
 */
export async function decrypt(encryptedData) {
  try {
    const key = await getKey();
    
    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedData).split('').map(c => c.charCodeAt(0))
    );
    
    // Extract IV and ciphertext
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error('Decryption error:', err);
    throw new Error('Failed to decrypt data - data may be corrupted', { cause: err });
  }
}
