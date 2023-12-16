import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const usersData = [
    { email: 'alice@example.com', firstName: 'Alice', lastName: 'White', password: 'A1b2c3d!', userType: 'Lister' },
    { email: 'bob@example.com', firstName: 'Bob', lastName: 'Hill', password: 'R4nDoM$5', userType: 'Lister' },
    { email: 'tito@example.com', firstName: 'Tito', lastName: 'Keen', password: 'Pass!w0rd', userType: 'Lister' },
    { email: 'fox@example.com', firstName: 'Fox', lastName: 'Adin', password: 'T3st@123', userType: 'Lister' },
    { email: 'sky@example.com', firstName: 'Sky', lastName: 'Fall', password: 'Val!d8Pw', userType: 'Lister' },
    { email: 'lin@example.com', firstName: 'Lin', lastName: 'Tenson', password: 'Qwerty@7', userType: 'Lister' },
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
          city: "Austin",
          rent: 1000.0,
          published: false,
          title: "My Listing Title",
          zipCode: "78704",
          // ...other fields for the listing
        },
        {
          authorId: user.id,
          city: "Seattle",
          rent: 1500.0,
          published: true,
          title: "My Listing Title Two",
          zipCode: "55401",
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