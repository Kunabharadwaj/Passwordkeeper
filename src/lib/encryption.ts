import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY is not defined in environment variables')
}

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
}

export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}