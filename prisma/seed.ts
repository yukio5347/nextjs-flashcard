import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  let contents = '';
  for (let i = 0; i < 10; i++) {
    contents += faker.lorem.word() + ',' + faker.lorem.word() + '\n';
  }

  const card = await prisma.card.create({
    data: {
      title: faker.lorem.words(),
      content: contents,
    },
  });
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