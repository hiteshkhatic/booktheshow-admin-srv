import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"

export const adminsTable = pgTable("admin", {
    id: uuid().primaryKey().defaultRandom(),
    username: text().notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow()
})
