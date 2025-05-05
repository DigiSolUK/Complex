import { db } from '../server/db';
import { cryptoService } from '../server/crypto';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('Seeding admin user...');

  try {
    // Check if the admin user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, 'admin'))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('Admin user already exists.');
      return;
    }

    // Create admin user
    const hashedPassword = await cryptoService.hashPassword('admin123');
    await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@complexcare.dev',
      role: 'superadmin',
      name: 'Admin User',
    });

    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    process.exit();
  }
}

main();
