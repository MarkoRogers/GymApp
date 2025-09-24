import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial,
} from "drizzle-orm/pg-core";
import { count, eq, ilike } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// Safe DB init
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  const client = neon(process.env.DATABASE_URL);
  db = drizzle(client);
} else {
  console.warn("⚠️ DATABASE_URL is not set. DB queries will be disabled.");
}

export { db };

// ---------------- Products Table ----------------
export const statusEnum = pgEnum("status", ["active", "inactive", "archived"]);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  name: text("name").notNull(),
  status: statusEnum("status").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull(),
  availableAt: timestamp("available_at").notNull(),
});

export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  if (!db) return { products: [], newOffset: null, totalProducts: 0 };

  if (search) {
    return {
      products: await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalProducts: 0,
    };
  }

  if (offset === null) return { products: [], newOffset: null, totalProducts: 0 };

  const totalProducts = await db.select({ count: count() }).from(products);
  const moreProducts = await db.select().from(products).limit(5).offset(offset);
  const newOffset = moreProducts.length >= 5 ? offset + 5 : null;

  return {
    products: moreProducts,
    newOffset,
    totalProducts: totalProducts[0].count,
  };
}

export async function deleteProductById(id: number) {
  if (!db) return;
  await db.delete(products).where(eq(products.id, id));
}

// ---------------- Users Table ----------------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  username: text("username"),
});

export type SelectUser = typeof users.$inferSelect;

// Fetch all users
export async function getUsers(): Promise<SelectUser[]> {
  if (!db) return [];
  return db.select().from(users);
}

// Insert test user (will skip if already exists)
export async function insertTestUser() {
  if (!db) return;
  await db
    .insert(users)
    .values({
      email: "me@site.com",
      name: "Me",
      username: "username",
    })
    .onConflictDoNothing();
}
