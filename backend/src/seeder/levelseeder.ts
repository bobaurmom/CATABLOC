import fs from 'fs';
import path from 'path';
import { Level } from '../models'; // Adjust path to your Level model
import sequelize from '../config/sequelize';

const seedLevels = async () => {
  try {
    // Connect to DB
    await sequelize.authenticate();
    console.log('✓ Connection established for seeding...');

    // Read the JSON file
    const filePath = path.join(__dirname, '../../src/database/level.json');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Level data file not found at: ${filePath}`);
    }
    
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const levels = JSON.parse(rawData);

    // Validate that levels is an array
    if (!Array.isArray(levels)) {
      throw new Error('Level data must be an array');
    }

    console.log(`Found ${levels.length} levels to seed...`);

    // Optional if want to Clear existing levels
    // await Level.destroy({ where: {}, truncate: true });
    // console.log('Existing levels cleared');

    // Insert data with validation
    let successCount = 0;
    let skipCount = 0;

    for (const levelData of levels) {
      try {
        // Validate required fields
        if (!levelData.title) {
          console.warn(`Warning: Level missing title, using default`);
        }

        // Parse available_codeblocks if it's already an array
        const codeblocks = Array.isArray(levelData.available_codeblocks)
          ? JSON.stringify(levelData.available_codeblocks)
          : (levelData.available_codeblocks || '[]');

        // Check if level already exists (optional - prevents duplicates)
        const existingLevel = await Level.findOne({
          where: {
            game_id: levelData.game_id || 1,
            level_number: levelData.level_number || 1
          }
        });

        if (existingLevel) {
          await existingLevel.update({
            title: levelData.title || 'Untitled Level',
            description: levelData.description || '',
            available_codeblocks: codeblocks,
            difficulty: levelData.difficulty || 'easy',
            level_layout: levelData.layout || levelData.level_layout || {},
          });
          console.log(` Updated level ${levelData.level_number}: ${levelData.title}`);
          successCount++;
          continue;
        }

        // Create the level
        await Level.create({
          title: levelData.title || 'Untitled Level',
          description: levelData.description || '',
          available_codeblocks: codeblocks,
          difficulty: levelData.difficulty || 'easy',
          game_id: levelData.game_id || 1,
          level_number: levelData.level_number || 1,
          level_layout: levelData.layout || levelData.level_layout || {},
        });

        successCount++;
        console.log(` Created level ${levelData.level_number}: ${levelData.title}`);

      } catch (levelError: any) {
        console.error(` Failed to create level ${levelData.level_number}:`, levelError.message);
      }
    }

    console.log('\n=== Seeding Summary ===');
    console.log(`Successfully created: ${successCount} levels`);
    console.log(` Skipped (duplicates): ${skipCount} levels`);
    console.log(`Failed: ${levels.length - successCount - skipCount} levels`);
    
    await sequelize.close();
    process.exit(0);

  } catch (error: any) {
    console.error('Seeding failed:', error.message);
    console.error(error);
    await sequelize.close();
    process.exit(1);
  }
};

seedLevels();