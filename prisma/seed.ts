import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { DATABASE_URL } from "../src/config/env";

const connectionString = `${DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	await prisma.user.upsert({
		where: { email: 'test@test.com' },
		create: {
			id: 'test_user_id',
			email: 'test@test.com',
			name: 'Test User',
			passwordHash: 'test_password',
		},
		update: {},
	});
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });