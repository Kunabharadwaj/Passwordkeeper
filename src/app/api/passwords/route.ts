import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { encrypt, decrypt } from '@/lib/encryption'
import { CreatePasswordData, Password } from '@/types/password'
import { AuthenticatedSession } from '@/types/next-auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session as AuthenticatedSession).user.id
    const client = await clientPromise
    const db = client.db('passwordkeeper')
    const passwords = await db
      .collection('passwords')
      .find({ userId: userId })
      .toArray()

    // Decrypt passwords before sending to client
    const decryptedPasswords = passwords.map((password) => ({
      ...password,
      _id: password._id.toString(),
      password: decrypt(password.password),
    }))

    return NextResponse.json(decryptedPasswords)
  } catch (error) {
    console.error('Error fetching passwords:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session as AuthenticatedSession).user.id
    const body: CreatePasswordData = await request.json()
    const { appName, username, password } = body

    if (!appName || !username || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('passwordkeeper')
    
    const newPassword: Omit<Password, '_id'> = {
      userId: userId,
      appName,
      username,
      password: encrypt(password), // Encrypt password before storing
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection('passwords').insertOne(newPassword)

    return NextResponse.json({ 
      _id: result.insertedId.toString(),
      ...newPassword,
      password: password // Return unencrypted password to client
    })
  } catch (error) {
    console.error('Error creating password:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}