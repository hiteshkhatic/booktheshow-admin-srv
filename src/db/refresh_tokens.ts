import { pgTable, text, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { adminsTable } from "./admin.js";

export const refreshTokensTable = pgTable('refresh_tokens', {
    id: uuid().primaryKey().defaultRandom(),
    adminId: uuid("admin_id").references(() => adminsTable.id).notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revoked: boolean().default(false),
    cratedAt: timestamp("created_at").defaultNow()
})