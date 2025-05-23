import CryptoJS from 'crypto-js';

const SECRET_KEY = 'vlee';

export function encryptNumber(num: number): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(num.toString(), SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

export function encryptTimestamp(timestamp: number): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(timestamp.toString(), SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Timestamp encryption error:', error);
    throw error;
  }
}

export function decryptTimestamp(encrypted: string): number {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return parseInt(decrypted, 10);
  } catch (error) {
    console.error('Timestamp decryption error:', error);
    throw error;
  }
}

export function decryptNumber(encrypted: string): number {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return parseInt(decrypted, 10);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}

export function generateTicketUrl(num: number): string {
  const encryptedNum = encryptNumber(num);
  const timestamp = Date.now();
  const encryptedTimestamp = encryptTimestamp(timestamp);
  return `${window.location.origin}/ticket?token=${encryptedNum}&timestamp=${encryptedTimestamp}`;
}

export function parseTicketUrl(url: string): { number: number | null, timestamp: number | null } {
  try {
    // Extract token and timestamp from URL string
    const tokenMatch = url.match(/token=([^&]+)/);
    const timestampMatch = url.match(/timestamp=([^&]+)/);
    
    if (!tokenMatch) return { number: null, timestamp: null };
    
    const token = decodeURIComponent(tokenMatch[1]);
    if (!token) return { number: null, timestamp: null };
    
    const number = decryptNumber(token);
    const timestamp = timestampMatch ? decryptTimestamp(decodeURIComponent(timestampMatch[1])) : null;
    
    return { number, timestamp };
  } catch (error) {
    console.error('URL parsing error:', error);
    return { number: null, timestamp: null };
  }
}
