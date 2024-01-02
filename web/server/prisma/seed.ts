import { PrismaClient } from '@prisma/client'

const client = new PrismaClient();

async function seed() {
  await client.user.create({data: {email: "notarealemail@gmail.com"}})
}


seed()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  }).finally(() => {
    client.$disconnect();
  });
  
