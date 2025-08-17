export interface Password {
  _id?: string
  userId: string
  appName: string
  username: string
  password: string // This will be encrypted in the database
  createdAt: Date
  updatedAt: Date
}

export interface CreatePasswordData {
  appName: string
  username: string
  password: string
}

export interface UpdatePasswordData {
  appName?: string
  username?: string
  password?: string
}