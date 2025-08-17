import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodb'
import { RegisterData } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('passwordkeeper')
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    }

    const result = await db.collection('users').insertOne(newUser)

    return NextResponse.json({ 
      message: 'User created successfully',
      userId: result.insertedId.toString()
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}