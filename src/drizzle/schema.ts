import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").notNull().primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  isActive: boolean("isActive").notNull().default(false),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
