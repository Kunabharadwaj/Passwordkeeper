export interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export const defaultPasswordOptions: PasswordOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
}

export function generatePassword(options: PasswordOptions = defaultPasswordOptions): string {
  let charset = ''
  
  if (options.includeLowercase) {
    charset += 'abcdefghijklmnopqrstuvwxyz'
  }
  
  if (options.includeUppercase) {
    charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }
  
  if (options.includeNumbers) {
    charset += '0123456789'
  }
  
  if (options.includeSymbols) {
    charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  }
  
  if (charset === '') {
    throw new Error('At least one character type must be selected')
  }
  
  let password = ''
  for (let i = 0; i < options.length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  
  return password
}