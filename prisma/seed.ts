import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const usersData = [
    { email: 'alice@example.com', firstName: 'Alice', lastName: 'White', password: 'password1' },
    { email: 'bob@example.com', firstName: 'Bob', lastName: 'Hill', password: 'password2' },
    { email: 'tito@example.com', firstName: 'Tito', lastName: 'Keen', password: 'password3' },
    { email: 'fox@example.com', firstName: 'Fox', lastName: 'Adin', password: 'password4' },
    { email: 'sky@example.com', firstName: 'Sky', lastName: 'Fall', password: 'password5' },
    { email: 'lin@example.com', firstName: 'Lin', lastName: 'Tenson', password: 'password6' },
    // ...add more users as needed
  ];

  for (const userData of usersData) {
    const tempPassword = userData.password;
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    userData.password = hashedPassword;
    const user = await prisma.user.create({
      data: userData
    });

    await prisma.listing.createMany({
      data: [
        {
          authorId: user.id,
          rent: 1000.0,
          published: false,
          title: "My Listing Title",
          // ...other fields for the listing
        },
        {
          authorId: user.id,
          rent: 1500.0,
          published: true,
          title: "My Listing Title Two",
          // ...other fields for the listing
        },
        // ...add more listings as needed for each user
      ]
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })