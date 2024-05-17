import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    await prisma.message.deleteMany({});
    await prisma.channelMembership.deleteMany({});
    await prisma.channel.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.userRole.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.category.deleteMany({});

    // Créer des rôles
    const coachRole = await prisma.role.create({
      data: {
        name: 'Coach',
        description: 'Fournit des services de coaching'
      },
    });

    const studentRole = await prisma.role.create({
      data: {
        name: 'Student',
        description: 'Recherche des services de coaching'
      },
    });

// Créer des utilisateurs
    const user1 = await prisma.user.create({
      data: {
        email: 'coach@example.com',
        password: await bcrypt.hash('motdepasse', 10), // Hasher le mot de passe
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
        password: await bcrypt.hash('motdepasse', 10), // Hasher le mot de passe
        name: 'Jane Student',
        isAdmin: false,
        userRoles: {
          create: [{ roleId: studentRole.id }],
        },
      },
    });

    // Créer un deuxième coach
    const user3 = await prisma.user.create({
      data: {
        email: 'coach2@example.com',
        password: await bcrypt.hash('autremotdepasse', 10), // Hasher un autre mot de passe
        name: 'Ella Coach',
        isAdmin: false,
        userRoles: {
          create: [{ roleId: coachRole.id }],
        },
      },
    });


    // Créer des catégories
    const category1 = await prisma.category.create({
      data: {
        name: 'Échecs',
      },
    });

    const category2 = await prisma.category.create({
      data: {
        name: 'Programmation',
      },
    });

    // Créer des posts
    const post1 = await prisma.post.create({
      data: {
        title: 'Cours d\'échecs',
        content: 'Apprenez les échecs avec un coach expérimenté.',
        published: true,
        categoryId: category1.id,
        authorId: user1.id,
      },
    });

    const post2 = await prisma.post.create({
      data: {
        title: 'Tutorat en programmation',
        content: 'Améliorez vos compétences en programmation avec un tuteur professionnel.',
        published: true,
        categoryId: category2.id,
        authorId: user1.id,
      },
    });

    const post3 = await prisma.post.create({
      data: {
        title: 'Cours d\'initiation aux échecs',
        content: 'Découvrez les bases des échecs avec un coach expérimenté.',
        published: true,
        categoryId: category1.id,
        authorId: user3.id,  // Utilisez l'ID du deuxième coach
      },
    });

    // Créer des reviews
    const review1 = await prisma.review.create({
      data: {
        content: 'Super session de coaching en échecs !',
        authorId: user2.id,
      },
    });

    // Créer des cours
    const course1 = await prisma.course.create({
      data: {
        name: 'Stratégies avancées aux échecs',
        description: 'Apprenez des stratégies avancées aux échecs.',
        price: 49.99,
        imageUrl: 'https://source.unsplash.com/random/300x200?chess',
        authorId: user1.id,
      },
    });

    const course2 = await prisma.course.create({
      data: {
        name: 'Introduction à JavaScript',
        description: 'Apprenez les bases de la programmation JavaScript.',
        price: 29.99,
        imageUrl: 'https://source.unsplash.com/random/300x200?programming',
        authorId: user1.id,
      },
    });

    const course3 = await prisma.course.create({
      data: {
        name: 'Maîtrise du JavaScript',
        description: 'Passez au niveau supérieur en JavaScript avec des projets pratiques.',
        price: 59.99,
        imageUrl: 'https://source.unsplash.com/random/300x200?code',
        authorId: user3.id,  // Utilisez l'ID du deuxième coach
      },
    });

    // Créer des canaux
    const channel1 = await prisma.channel.create({
      data: {
        name: 'Cours de coaching aux échecs',
        courseId: course1.id,
      },
    });

    const channel2 = await prisma.channel.create({
      data: {
        name: 'Canal d\'aide à la programmation',
        courseId: course2.id,
      },
    });

    const channel3 = await prisma.channel.create({
      data: {
        name: 'Cours avancé de JavaScript',
        courseId: course3.id,
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

    await prisma.channelMembership.create({
      data: {
        userId: user3.id,
        channelId: channel3.id,
        hasAcceptedAccess: true,
      },
    });

    // Créer des messages
    await prisma.message.create({
      data: {
        content: 'Bienvenue dans le canal de coaching aux échecs !',
        authorId: user1.id,
        channelId: channel1.id,
      },
    });

    await prisma.message.create({
      data: {
        content: 'Besoin d\'aide avec JavaScript.',
        authorId: user2.id,
        channelId: channel2.id,
      },
    });

    await prisma.message.create({
      data: {
        content: 'Prêt à explorer JavaScript plus en profondeur?',
        authorId: user3.id,
        channelId: channel3.id,
      },
    });

    console.log('Le remplissage de la base de données est terminé.');
  } catch (error) {
    console.error('Une erreur s\'est produite pendant le remplissage de la base de données :', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
