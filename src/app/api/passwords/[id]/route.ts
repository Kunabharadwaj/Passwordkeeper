import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { encrypt } from '@/lib/encryption'
import { UpdatePasswordData } from '@/types/password'
import { AuthenticatedSession } from '@/types/next-auth'
import { ObjectId } from 'mongodb'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session as AuthenticatedSession).user.id
    const resolvedParams = await params
    const body: UpdatePasswordData = await request.json()
    const { appName, username, password } = body

    if (!appName && !username && !password) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('passwordkeeper')
    
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (appName) updateData.appName = appName
    if (username) updateData.username = username
    if (password) updateData.password = encrypt(password)

    const result = await db.collection('passwords').updateOne(
      { 
        _id: new ObjectId(resolvedParams.id),
        userId: userId 
      },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Password not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session as AuthenticatedSession).user.id
    const resolvedParams = await params
    const client = await clientPromise
    const db = client.db('passwordkeeper')
    
    const result = await db.collection('passwords').deleteOne({
      _id: new ObjectId(resolvedParams.id),
      userId: userId
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Password not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Password deleted successfully' })
  } catch (error) {
    console.error('Error deleting password:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}