import CryptoJS from 'crypto-js';

// Use a fixed key for demo purposes - in production, this should be from environment
const ENCRYPTION_KEY = 'marketplace-demo-key-2024';

export function encryptData(data: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export function decryptData(encryptedData: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Decryption failed - invalid encrypted data');
    }
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

export function encryptCustomerDetails(details: any): string {
  return encryptData(JSON.stringify(details));
}

export function decryptCustomerDetails(encryptedDetails: string): any {
  const decrypted = decryptData(encryptedDetails);
  return JSON.parse(decrypted);
}

// Export aliases for backwards compatibility
export const encrypt = encryptData;
export const decrypt = decryptData;