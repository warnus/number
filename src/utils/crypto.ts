import { createHash, createCipheriv, createDecipheriv } from 'crypto';

const SECRET_KEY = 'your-secret-key-1234567890123456'; // 32자 이상의 길이로 변경해야 합니다
const IV = Buffer.from('1234567890123456'); // 16자리

export function encryptNumber(num: number): string {
  try {
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), IV);
    let encrypted = cipher.update(num.toString(), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

export function decryptNumber(encrypted: string): number {
  try {
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), IV);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
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
