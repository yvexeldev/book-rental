import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create mock users
  const user1 = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123', // In production, hash the password before saving
      isVerified: true,
      username: 'john_doe',
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'janesmith@example.com',
      password: 'password123', // In production, hash the password before saving
      isVerified: true,
      username: 'jane_smith',
      role: Role.ADMIN,
    },
  });

  // Create mock books
  const book1 = await prisma.book.create({
    data: {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      available_copies: 5,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      available_copies: 3,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '9780061120084',
      available_copies: 2,
    },
  });

  // Create mock rentals
  await prisma.rental.create({
    data: {
      userId: user1.id,
      bookId: book1.id,
      givenDate: new Date('2024-11-01T10:00:00Z'),
      returnedDate: new Date('2024-11-10T10:00:00Z'),
    },
  });

  await prisma.rental.create({
    data: {
      userId: user2.id,
      bookId: book2.id,
      givenDate: new Date('2024-11-05T10:00:00Z'),
      returnedDate: null, // still not returned
    },
  });
  await prisma.rental.create({
    data: {
      userId: user2.id,
      bookId: book3.id,
      givenDate: new Date('2024-11-05T10:00:00Z'),
      returnedDate: null, // still not returned
    },
  });

  console.log('Mock data seeded!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
