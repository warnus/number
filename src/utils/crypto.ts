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
  return `${window.location.origin}/ticket?token=${encryptedNum}`;
}

export function parseTicketUrl(url: string): number | null {
  try {
    const urlObj = new URL(url);
    const token = urlObj.searchParams.get('token');
    if (!token) return null;
    return decryptNumber(token);
  } catch (error) {
    console.error('URL parsing error:', error);
    return null;
  }
}
