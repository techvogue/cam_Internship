import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (in development)
  await prisma.incident.deleteMany()
  await prisma.camera.deleteMany()
  await prisma.user.deleteMany()
  
  // Create cameras
  const cameras = await Promise.all([
    prisma.camera.create({
      data: {
        name: 'CAM-ENTRANCE-01',
        location: 'Main Entrance Lobby',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'CAM-VAULT-01',
        location: 'High Security Vault Area',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'CAM-FLOOR-A1',
        location: 'Shop Floor Section A',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'CAM-PARKING-01',
        location: 'Employee Parking Lot',
      },
    }),
  ])

  console.log(`✅ Created ${cameras.length} cameras`)

  // Create predefined user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@mandlacx.com',
      password: hashedPassword,
    },
  })

  console.log(`✅ Created admin user: ${adminUser.email}`)

  // Create incidents
  const incidentTypes = [
    { type: 'Gun Threat', priority: 'critical' },
    { type: 'Unauthorized Access', priority: 'high' },
    { type: 'Face Recognised', priority: 'medium' },
    { type: 'Suspicious Behavior', priority: 'medium' },
  ]

  const incidents = []
  const now = new Date()

  // Generate incidents over the past 3 days
  for (let day = 0; day < 3; day++) {
    const dayStart = new Date(now.getTime() - (day * 24 * 60 * 60 * 1000))
    
    for (let i = 0; i < 5; i++) {
      const incidentType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)]
      const camera = cameras[Math.floor(Math.random() * cameras.length)]
      
      const hourOffset = Math.floor(Math.random() * 24)
      const minuteOffset = Math.floor(Math.random() * 60)
      const tsStart = new Date(dayStart.getTime() + (hourOffset * 60 * 60 * 1000) + (minuteOffset * 60 * 1000))
      
      const durationMinutes = Math.floor(Math.random() * 30) + 5
      const tsEnd = new Date(tsStart.getTime() + (durationMinutes * 60 * 1000))
      
      incidents.push({
        cameraId: camera.id,
        type: incidentType.type,
        tsStart,
        tsEnd,
        thumbnailUrl: `/thumbnails/incident-${Math.floor(Math.random() * 10) + 1}.jpg`,
        videoUrl: '/video/firstincident.mp4',
        resolved: Math.random() > 0.7, // 30% resolved
      })
    }
  }

  await prisma.incident.createMany({
    data: incidents,
  })

  console.log(`✅ Created ${incidents.length} incidents`)
  
  // Print summary
  const totalIncidents = await prisma.incident.count()
  const unresolvedIncidents = await prisma.incident.count({ where: { resolved: false } })
  const totalCameras = await prisma.camera.count()
  
  console.log('\n📊 Database Seed Summary:')
  console.log(`   Cameras: ${totalCameras}`)
  console.log(`   Total Incidents: ${totalIncidents}`)
  console.log(`   Unresolved Incidents: ${unresolvedIncidents}`)
  console.log('\n🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
