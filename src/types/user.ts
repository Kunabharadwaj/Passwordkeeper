export interface User {
  _id?: string
  email: string
  password: string
  name: string
  createdAt: Date
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface LoginData {
  email: string
  password: string
}