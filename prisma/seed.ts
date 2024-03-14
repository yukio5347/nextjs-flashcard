import { Card, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const card: Card = await prisma.card.create({
    data: {
      title: faker.lorem.words(),
    },
  });

  for (let i = 0; i < 10; i++) {
    await prisma.word.create({
      data: {
        front: faker.lorem.words(),
        back: faker.lorem.words(),
        cardId: card.id,
      },
    });
  }


  console.log(card);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });