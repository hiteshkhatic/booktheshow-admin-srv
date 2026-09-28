import type { createAdminDTO } from "../dto/admin.dto.js"
import { db } from "../conn.js"
import { adminsTable } from "../db/admin.js"
import { eq } from "drizzle-orm"
import { refreshTokensTable } from "../db/refresh_tokens.js"

export const createAdmin = async (
  data: createAdminDTO & { password_hash: string },
) => {
  const [admin] = await db
    .insert(adminsTable)
    .values({
      username: data.username,
      passwordHash: data.password_hash,
    })
    .returning()
  return admin
}

export const findAdminByUsername = async (username: string) => {
  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, username))

  return admin ?? null
}

export const storeRefreshToken = async (
  adminId: string,
  refreshToken: string,
  expiresAt: Date,
) => {
  return db.insert(refreshTokensTable).values({
    adminId: adminId,
    tokenHash: refreshToken,
    expiresAt: expiresAt,
  })
}
