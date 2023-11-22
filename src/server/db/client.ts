import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Singleton pattern for PrismaClient
let prisma: PrismaClient;

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });
}

prisma = global.prisma;

export { prisma };
