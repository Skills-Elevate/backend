import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Créer des rôles
  const coachRole = await prisma.role.create({
    data: {
      name: 'Coach',
      description: 'Provides coaching services'
    },
  });

  const studentRole = await prisma.role.create({
    data: {
      name: 'Student',
      description: 'Seeks coaching services'
    },
  });

  // Créer des utilisateurs
  const user1 = await prisma.user.create({
    data: {
      email: 'coach@example.com',
      password: 'securepassword',
      name: 'John Coach',
      isAdmin: false,
      userRoles: {
        create: [{ roleId: coachRole.id }],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'student@example.com',
      password: 'securepassword',
      name: 'Jane Student',
      isAdmin: false,
      userRoles: {
        create: [{ roleId: studentRole.id }],
      },
    },
  });

  // Créer des catégories
  const category1 = await prisma.category.create({
    data: {
      name: 'Chess',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Programming',
    },
  });

  // Créer des posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Chess Coaching',
      content: 'Learn chess with an experienced coach.',
      published: true,
      categoryId: category1.id,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Programming Tutoring',
      content: 'Improve your coding skills with a professional tutor.',
      published: true,
      categoryId: category2.id,
      authorId: user1.id,
    },
  });

  // Créer des reviews
  const review1 = await prisma.review.create({
    data: {
      content: 'Great chess coaching session!',
      authorId: user2.id,
    },
  });

  // Créer des cours
  const course1 = await prisma.course.create({
    data: {
      name: 'Advanced Chess Strategies',
      description: 'Learn advanced strategies in chess.',
      price: 49.99,
      imageUrl: 'https://source.unsplash.com/random/300x200?chess',
      author: 'John Coach',
    },
  });

  const course2 = await prisma.course.create({
    data: {
      name: 'Introduction to JavaScript',
      description: 'Learn the basics of JavaScript programming.',
      price: 29.99,
      imageUrl: 'https://source.unsplash.com/random/300x200?programming',
      author: 'John Coach',
    },
  });

  // Créer des canaux
  const channel1 = await prisma.channel.create({
    data: {
      name: 'Chess Coaching Channel',
    },
  });

  const channel2 = await prisma.channel.create({
    data: {
      name: 'Programming Help Channel',
    },
  });

  // Ajouter des membres aux canaux
  await prisma.channelMembership.create({
    data: {
      userId: user1.id,
      channelId: channel1.id,
      hasAcceptedAccess: true,
    },
  });

  await prisma.channelMembership.create({
    data: {
      userId: user2.id,
      channelId: channel2.id,
      hasAcceptedAccess: true,
    },
  });

  // Créer des messages
  await prisma.message.create({
    data: {
      content: 'Welcome to the Chess Coaching Channel!',
      authorName: user1.id,
      channelId: channel1.id,
    },
  });

  await prisma.message.create({
    data: {
      content: 'Need help with JavaScript.',
      authorName: user2.id,
      channelId: channel2.id,
    },
  });

  console.log('Seeding completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
