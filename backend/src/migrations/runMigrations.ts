import path from 'path';
import fs from 'fs';
import sequelize from '../config/sequelize';

const runMigrations = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    console.log(`\n📋 Found ${files.length} migration files`);

    for (const file of files) {
      if (file === 'index.ts') continue;
      
      const filePath = path.join(migrationsDir, file);
      const migration = require(filePath).default || require(filePath);
      
      try {
        console.log(`\n▶ Running ${file}...`);
        await migration.up(sequelize.getQueryInterface(), require('sequelize'));
        console.log(`✓ ${file} completed`);
      } catch (error: any) {
        // Some migrations may fail if already applied - that's ok
        if (error.message && error.message.includes('already exists')) {
          console.log(`⊘ ${file} skipped (already applied)`);
        } else {
          console.error(`✗ ${file} failed:`, error.message);
        }
      }
    }

    console.log('\n✓ Migration run completed');
    await sequelize.close();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
