import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const dog = await prisma.dogProfile.findFirst()
  return Response.json(dog)
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const name = formData.get('name') as string
  const photo = formData.get('photo') as File | null

  const dog = await prisma.dogProfile.findFirst()
  if (!dog) return Response.json({ error: 'Dog profile not found' }, { status: 404 })

  let photoUrl = dog.photoUrl

  if (photo && photo.size > 0) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(photo.type)) {
      return Response.json({ error: 'Invalid file type' }, { status: 400 })
    }
    if (photo.size > 5 * 1024 * 1024) {
      return Response.json({ error: 'File too large' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'dog')
    await mkdir(uploadDir, { recursive: true })

    const ext = photo.name.split('.').pop() || 'jpg'
    const filename = `dog-${Date.now()}.${ext}`
    const filePath = path.join(uploadDir, filename)

    const bytes = await photo.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    photoUrl = `/dog/${filename}`
  }

  const updated = await prisma.dogProfile.update({
    where: { id: dog.id },
    data: { name: name || dog.name, photoUrl },
  })

  return Response.json(updated)
}
