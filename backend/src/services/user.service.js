import { prisma } from "../../prisma/client.js";

export const userService = {
  // GET /users → (if you use it)
  async getAll() {
    return prisma.user.findMany();
  },

  // POST /users → create new user (maybe later via bot)
  async create(data) {
    return prisma.user.create({ data });
  },

  // GET /users/:id → one user
  async getById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        listings: true,      // listings this user owns
      },
    });
  },

  // PATCH /users/:id → update settings, phone, etc.
  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },
};
