import { db } from "@/drizzle";
import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { usersTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

const insertUserSchema = createInsertSchema(usersTable);
const updateUserSchema = insertUserSchema.partial().required({ id: true });

export const userRouter = router({
  getAllUsers: publicProcedure.query(async () => {
    const users = await db.query.usersTable.findMany();
    return users;
  }),
  createUser: publicProcedure.input(insertUserSchema).mutation(async (opts) => {
    const user = opts.input;
    await db.insert(usersTable).values(user);
    return true;
  }),
  updateUser: publicProcedure.input(updateUserSchema).mutation(async (opts) => {
    const { id, ...user } = opts.input;
    await db.update(usersTable).set(user).where(eq(usersTable.id, id));
    return true;
  }),
  deleteUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async (opts) => {
      await db.delete(usersTable).where(eq(usersTable.id, opts.input.id));
      return true;
    }),
});
