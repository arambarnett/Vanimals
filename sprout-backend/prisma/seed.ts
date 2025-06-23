import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed animals that match the Flutter app mock data
  const animals = [
    {
      id: 'pigeon-id',
      name: 'Pigeon',
      imageUrl: 'https://example.com/pigeon.png',
    },
    {
      id: 'elephant-id', 
      name: 'Elephant',
      imageUrl: 'https://example.com/elephant.png',
    },
    {
      id: 'tiger-id',
      name: 'Tiger', 
      imageUrl: 'https://example.com/tiger.png',
    },
    {
      id: 'penguin-id',
      name: 'Penguin',
      imageUrl: 'https://example.com/penguin.png',
    },
  ];

  for (const animal of animals) {
    await prisma.animal.upsert({
      where: { id: animal.id },
      update: {},
      create: {
        id: animal.id,
        name: animal.name,
        imageUrl: animal.imageUrl,
        createdAt: new Date(),
      },
    });
  }

  // Seed a test user with multiple animals (representing user's collection)
  const testUser = await prisma.user.upsert({
    where: { id: 'test-user-id' },
    update: {},
    create: {
      id: 'test-user-id',
      privyId: 'privy-test-user',
      email: 'test@sprouts.com',
      name: 'Sprout Trainer',
      experience: 1250,
      level: 5,
      animalId: 'pigeon-id', // Default selected animal
      createdAt: new Date(),
    },
  });

  // Since the current schema only supports one animal per user, 
  // we'll use habits to represent the user's "collection" for now
  const userAnimals = [
    { name: 'Cosmic Pigeon', species: 'Pigeon', level: 5, rarity: 'Common' },
    { name: 'Space Elephant', species: 'Elephant', level: 8, rarity: 'Rare' },
    { name: 'Stellar Tiger', species: 'Tiger', level: 12, rarity: 'Epic' },
    { name: 'Arctic Penguin', species: 'Penguin', level: 3, rarity: 'Common' },
  ];

  // Clear existing habits for this user first
  await prisma.habit.deleteMany({
    where: { userId: testUser.id }
  });

  // Create new habits for user's collection
  for (const animal of userAnimals) {
    await prisma.habit.create({
      data: {
        userId: testUser.id,
        title: `${animal.name} (${animal.species}) - Level ${animal.level} - ${animal.rarity}`,
        frequency: animal.rarity,
        createdAt: new Date(),
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 