/**
 * Seeds / updates the primary admin. Run with:  npm run db:seed-admin
 *
 * Username + password come from env (ADMIN_USERNAME / ADMIN_PASSWORD) if set,
 * otherwise default to the primary admin. Idempotent — updates the password
 * hash if the username already exists.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { admins } from "./schema";

const USERNAME = (process.env.ADMIN_USERNAME ?? "alex").trim().toLowerCase();
const PASSWORD = process.env.ADMIN_PASSWORD ?? "BakersPerk@26";
const NAME = process.env.ADMIN_NAME ?? "Alex";

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  const existing = await db.select().from(admins).where(eq(admins.username, USERNAME)).limit(1);

  if (existing[0]) {
    await db
      .update(admins)
      .set({ passwordHash, isActive: true, name: NAME })
      .where(eq(admins.id, existing[0].id));
    console.log(`✓ Updated admin "${USERNAME}" (id ${existing[0].id})`);
  } else {
    const [row] = await db
      .insert(admins)
      .values({ name: NAME, username: USERNAME, passwordHash, role: "owner", isActive: true })
      .returning({ id: admins.id });
    console.log(`✓ Created admin "${USERNAME}" (id ${row.id})`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
