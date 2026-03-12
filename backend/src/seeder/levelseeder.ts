import fs from 'fs';
import path from 'path';
import { Level, BoardData, Game } from '../models'; // Adjust path to your Level model
import sequelize from '../config/sequelize';

const seedLevels = async () => {
  try {
    // Connect to DB
    await sequelize.authenticate();
    console.log('✓ Connection established for seeding...');

    // Create default game if it doesn't exist
    const [game, created] = await Game.findOrCreate({
      where: { game_id: 1 },
      defaults: {
        title: 'CATABLOC',
        description: 'A fun game where you guide a cat through puzzles',
        game_type: 'puzzle'
      }
    });

    if (created) {
      console.log('✓ Created default game: CATABLOC');
    } else {
      console.log('✓ Default game already exists');
    }

    // Create Game 2 - Quiz type
    const [game2, created2] = await Game.findOrCreate({
      where: { game_id: 2 },
      defaults: {
        title: 'Code Quiz',
        description: 'Test your programming knowledge with interactive quizzes',
        game_type: 'quiz'
      }
    });

    if (created2) {
      console.log('✓ Created new game: Code Quiz (Game 2 - Quiz Type)');
    } else {
      console.log('✓ Game 2 already exists');
    }
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

        let levelRecord;
        if (existingLevel) {
          await existingLevel.update({
            title: levelData.title || 'Untitled Level',
            description: levelData.description || '',
            difficulty: levelData.difficulty || 'easy',
            time_limit: levelData.time_limit || null,
          });
          console.log(` Updated level ${levelData.level_number}: ${levelData.title}`);
          levelRecord = existingLevel;
        } else {
          // Create the level
          levelRecord = await Level.create({
            title: levelData.title || 'Untitled Level',
            description: levelData.description || '',
            difficulty: levelData.difficulty || 'easy',
            game_id: levelData.game_id || 1,
            level_number: levelData.level_number || 1,
            time_limit: levelData.time_limit || null,
          });

          console.log(` Created level ${levelData.level_number}: ${levelData.title}`);
        }

        // Now create or update BoardData with level_layout
        const existingBoardData = await BoardData.findOne({
          where: { level_id: levelRecord.level_id }
        });

        const levelLayout = levelData.level_layout || levelData.layout || {};
        
        if (existingBoardData) {
          await existingBoardData.update({
            level_layout: levelLayout,
            block_limit: levelData.blocks_limit || null,
            game_id: levelData.game_id || 1,
            grid_size: levelLayout.width || 5,
            obstacles: JSON.stringify(levelLayout.obstacles || []),
            start_position: JSON.stringify(levelLayout.cat_start || { x: 0, y: 0 }),
            goal_position: JSON.stringify(levelLayout.goal || { x: 0, y: 0 }),
          });
          console.log(`   ✓ Updated BoardData for level ${levelData.level_number}`);
        } else {
          await BoardData.create({
            level_id: levelRecord.level_id,
            game_id: levelData.game_id || 1,
            level_layout: levelLayout,
            block_limit: levelData.blocks_limit || null,
            grid_size: levelLayout.width || 5,
            obstacles: JSON.stringify(levelLayout.obstacles || []),
            start_position: JSON.stringify(levelLayout.cat_start || { x: 0, y: 0 }),
            goal_position: JSON.stringify(levelLayout.goal || { x: 0, y: 0 }),
          });
          console.log(`   ✓ Created BoardData for level ${levelData.level_number}`);
        }

        successCount++;

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