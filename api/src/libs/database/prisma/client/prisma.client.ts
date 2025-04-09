import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient().$extends({
  query: {
    file: {
      async findMany({ args, query }) {
        const files = await query(args);
        return files.sort((a, b) =>
          (a.name ?? '')
            .toLowerCase()
            .localeCompare((b.name ?? '').toLowerCase()),
        );
      },
    },
  },
});

export default prismaClient;
