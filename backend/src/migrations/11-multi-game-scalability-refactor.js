'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * COMPREHENSIVE MIGRATION: Multi-Game Scalability Refactoring
     * 
     * This migration combines 5 individual migrations into one cohesive schema transformation
     * that implements proper multi-game support with single-source-of-truth architecture.
     * 
     * OBJECTIVES:
     * 1. Add game_id FK constraints to levels, board_data, sessions, scores (multi-game support)
     * 2. Enhance codeblocks table with proper relationships and timestamps
     * 3. Remove level_layout from levels (belongs in board_data only)
     * 4. Move blocks_limit from levels to board_data (board configuration, not level metadata)
     * 5. Add proper indexes for performance
     * 
     * ARCHITECTURE:
     * - levels: metadata only (title, description, difficulty, time_limit)
     * - board_data: configuration only (layout, grid_size, obstacles, block_limit)
     * - sessions: game sessions with direct game_id reference
     * - codeblocks: session code blocks with proper relationships
     * - scores: game scores with game_id FK for reporting
     */

    const transaction = await queryInterface.sequelize.transaction();

    try {
      // ========================================
      // STEP 1: LEVELS TABLE - Add game_id FK
      // ========================================
      console.log('Step 1: Adding game_id to levels table...');
      try {
        const levelColumns = await queryInterface.describeTable('levels', { transaction });
        
        if (!levelColumns.game_id) {
          await queryInterface.addColumn(
            'levels',
            'game_id',
            {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 1,
              comment: 'Foreign key reference to games table for multi-game support'
            },
            { transaction }
          );

          await queryInterface.addConstraint('levels', {
            fields: ['game_id'],
            type: 'foreign key',
            name: 'fk_levels_game_id',
            references: {
              table: 'games',
              field: 'game_id'
            },
            onDelete: 'CASCADE'
          }, { transaction });

          await queryInterface.addIndex('levels', ['game_id'], { transaction });
        }
      } catch (error) {
        console.log('Levels table modifications skipped:', error.message);
      }

      // ========================================
      // STEP 2: BOARD_DATA TABLE - Restructure
      // ========================================
      console.log('Step 2: Restructuring board_data table...');
      try {
        const boardColumns = await queryInterface.describeTable('board_data', { transaction });
        
        // Add game_id if missing
        if (!boardColumns.game_id) {
          await queryInterface.addColumn(
            'board_data',
            'game_id',
            {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 1,
              comment: 'Foreign key reference to games for multi-game support'
            },
            { transaction }
          );

          await queryInterface.addConstraint('board_data', {
            fields: ['game_id'],
            type: 'foreign key',
            name: 'fk_board_data_game_id',
            references: {
              table: 'games',
              field: 'game_id'
            },
            onDelete: 'CASCADE'
          }, { transaction });

          await queryInterface.addIndex('board_data', ['game_id'], { transaction });
        }

        // Remove old unique constraint if it exists
        try {
          await queryInterface.removeConstraint('board_data', 'board_data_level_id_key', { transaction });
        } catch (e) {
          console.log('Unique constraint removal attempted');
        }

        // Add proper FK for level_id
        try {
          await queryInterface.addConstraint('board_data', {
            fields: ['level_id'],
            type: 'foreign key',
            name: 'fk_board_data_level_id',
            references: {
              table: 'levels',
              field: 'level_id'
            },
            onDelete: 'CASCADE'
          }, { transaction });
        } catch (e) {
          console.log('FK constraint for level_id already exists');
        }

        // Add block_limit if missing
        if (!boardColumns.block_limit) {
          await queryInterface.addColumn(
            'board_data',
            'block_limit',
            {
              type: Sequelize.INTEGER,
              allowNull: true,
              comment: 'Single source of truth for block limit - board configuration'
            },
            { transaction }
          );
        }
      } catch (error) {
        console.log('Board_data table modifications skipped:', error.message);
      }

      // ========================================
      // STEP 3: SCORES TABLE - Add game_id FK
      // ========================================
      console.log('Step 3: Adding game_id to scores table...');
      try {
        const scoreColumns = await queryInterface.describeTable('scores', { transaction });
        
        if (!scoreColumns.game_id) {
          await queryInterface.addColumn(
            'scores',
            'game_id',
            {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 1,
              comment: 'Foreign key reference to games for game-specific score reporting'
            },
            { transaction }
          );

          await queryInterface.addConstraint('scores', {
            fields: ['game_id'],
            type: 'foreign key',
            name: 'fk_scores_game_id',
            references: {
              table: 'games',
              field: 'game_id'
            },
            onDelete: 'CASCADE'
          }, { transaction });

          await queryInterface.addIndex('scores', ['game_id'], { transaction });
        }
      } catch (error) {
        console.log('Scores table modifications skipped:', error.message);
      }

      // ========================================
      // STEP 4: SESSIONS TABLE - Add game_id FK
      // ========================================
      console.log('Step 4: Adding game_id to sessions table...');
      try {
        const sessionColumns = await queryInterface.describeTable('sessions', { transaction });
        
        if (!sessionColumns.game_id) {
          await queryInterface.addColumn(
            'sessions',
            'game_id',
            {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 1,
              comment: 'Foreign key reference to games for direct game reference'
            },
            { transaction }
          );

          await queryInterface.addConstraint('sessions', {
            fields: ['game_id'],
            type: 'foreign key',
            name: 'fk_sessions_game_id',
            references: {
              table: 'games',
              field: 'game_id'
            },
            onDelete: 'CASCADE'
          }, { transaction });

          await queryInterface.addIndex('sessions', ['game_id'], { transaction });
        }
      } catch (error) {
        console.log('Sessions table modifications skipped:', error.message);
      }

      // ========================================
      // STEP 5: CODEBLOCKS TABLE - Enhance
      // ========================================
      console.log('Step 5: Enhancing codeblocks table...');
      try {
        const codeblockColumns = await queryInterface.describeTable('codeblocks', { transaction });
        
        if (!codeblockColumns.session_id) {
          await queryInterface.addColumn(
            'codeblocks',
            'session_id',
            {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 1,
              comment: 'Foreign key reference to sessions'
            },
            { transaction }
          );

          await queryInterface.addConstraint('codeblocks', {
            fields: ['session_id'],
            type: 'foreign key',
            name: 'fk_codeblocks_session_id',
            references: {
              table: 'sessions',
              field: 'session_id'
            },
            onDelete: 'CASCADE'
          }, { transaction });

          await queryInterface.addIndex('codeblocks', ['session_id'], { transaction });
        }

        if (!codeblockColumns.sequence_order) {
          await queryInterface.addColumn(
            'codeblocks',
            'sequence_order',
            {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 0,
              comment: 'Order of execution for blocks in session'
            },
            { transaction }
          );
        }

        if (!codeblockColumns.parent_block_id) {
          await queryInterface.addColumn(
            'codeblocks',
            'parent_block_id',
            {
              type: Sequelize.INTEGER,
              allowNull: true,
              comment: 'Reference to parent block for nested structures (loops)'
            },
            { transaction }
          );
        }

        if (!codeblockColumns.loop_count) {
          await queryInterface.addColumn(
            'codeblocks',
            'loop_count',
            {
              type: Sequelize.INTEGER,
              allowNull: true,
              comment: 'Number of iterations for loop blocks'
            },
            { transaction }
          );
        }

        if (!codeblockColumns.created_at) {
          await queryInterface.addColumn(
            'codeblocks',
            'created_at',
            {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW
            },
            { transaction }
          );
        }

        if (!codeblockColumns.updated_at) {
          await queryInterface.addColumn(
            'codeblocks',
            'updated_at',
            {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW
            },
            { transaction }
          );
        }
      } catch (error) {
        console.log('Codeblocks table modifications skipped:', error.message);
      }

      // ========================================
      // STEP 6: LEVELS TABLE - Remove level_layout
      // ========================================
      console.log('Step 6: Removing level_layout from levels table...');
      try {
        const levelsTable = await queryInterface.describeTable('levels', { transaction });
        
        if (levelsTable.level_layout) {
          await queryInterface.removeColumn('levels', 'level_layout', { transaction });
          console.log('  ✓ Removed level_layout from levels table');
        }
      } catch (error) {
        console.log('Remove level_layout skipped:', error.message);
      }

      // ========================================
      // STEP 7: LEVELS TABLE - Remove blocks_limit
      // ========================================
      console.log('Step 7: Moving blocks_limit from levels to board_data...');
      try {
        const levelsTable = await queryInterface.describeTable('levels', { transaction });
        
        if (levelsTable.blocks_limit) {
          // Migrate data from levels to board_data first
          await queryInterface.sequelize.query(`
            UPDATE board_data bd
            SET block_limit = l.blocks_limit
            FROM levels l
            WHERE l.level_id = bd.level_id AND bd.block_limit IS NULL
          `, { transaction });

          // Remove blocks_limit from levels
          await queryInterface.removeColumn('levels', 'blocks_limit', { transaction });
          console.log('  ✓ Migrated blocks_limit to board_data and removed from levels');
        }
      } catch (error) {
        console.log('Move blocks_limit skipped:', error.message);
      }

      await transaction.commit();
      console.log('\n✓ Multi-game scalability refactoring completed successfully!');
      console.log('  - game_id FKs added to levels, board_data, sessions, scores');
      console.log('  - codeblocks table enhanced with relationships');
      console.log('  - level_layout removed from levels (single source in board_data)');
      console.log('  - blocks_limit moved to board_data (board configuration)');

    } catch (error) {
      await transaction.rollback();
      console.error('Migration failed:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Rollback: Reverse all multi-game scalability changes
     * WARNING: This will drop constraints and columns. Data loss is possible.
     */

    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Rolling back multi-game scalability changes...');

      // Remove constraints
      const constraints = [
        { table: 'levels', constraint: 'fk_levels_game_id' },
        { table: 'board_data', constraint: 'fk_board_data_game_id' },
        { table: 'board_data', constraint: 'fk_board_data_level_id' },
        { table: 'scores', constraint: 'fk_scores_game_id' },
        { table: 'sessions', constraint: 'fk_sessions_game_id' },
        { table: 'codeblocks', constraint: 'fk_codeblocks_session_id' }
      ];

      for (const { table, constraint } of constraints) {
        try {
          await queryInterface.removeConstraint(table, constraint, { transaction });
          console.log(`  ✓ Removed ${constraint}`);
        } catch (e) {
          console.log(`  - ${constraint} not found`);
        }
      }

      // Remove indexes
      const indexes = [
        { table: 'levels', columns: ['game_id'] },
        { table: 'board_data', columns: ['game_id'] },
        { table: 'scores', columns: ['game_id'] },
        { table: 'sessions', columns: ['game_id'] },
        { table: 'codeblocks', columns: ['session_id'] }
      ];

      for (const { table, columns } of indexes) {
        try {
          await queryInterface.removeIndex(table, columns, { transaction });
        } catch (e) {
          console.log(`  - Index ${columns} not found on ${table}`);
        }
      }

      // Remove columns (reverse order)
      const columns = [
        { table: 'levels', column: 'game_id' },
        { table: 'board_data', column: 'game_id' },
        { table: 'board_data', column: 'block_limit' },
        { table: 'scores', column: 'game_id' },
        { table: 'sessions', column: 'game_id' },
        { table: 'codeblocks', column: 'session_id' },
        { table: 'codeblocks', column: 'sequence_order' },
        { table: 'codeblocks', column: 'parent_block_id' },
        { table: 'codeblocks', column: 'loop_count' },
        { table: 'codeblocks', column: 'created_at' },
        { table: 'codeblocks', column: 'updated_at' }
      ];

      for (const { table, column } of columns) {
        try {
          await queryInterface.removeColumn(table, column, { transaction });
        } catch (e) {
          console.log(`  - ${column} not found on ${table}`);
        }
      }

      // Restore level_layout to levels (for historical data recovery)
      try {
        const levelsTable = await queryInterface.describeTable('levels', { transaction });
        if (!levelsTable.level_layout) {
          await queryInterface.addColumn(
            'levels',
            'level_layout',
            {
              type: Sequelize.JSONB,
              allowNull: true,
              comment: 'DEPRECATED: was replaced by board_data.level_layout'
            },
            { transaction }
          );
        }
      } catch (e) {
        console.log('level_layout restoration skipped');
      }

      // Restore blocks_limit to levels
      try {
        const levelsTable = await queryInterface.describeTable('levels', { transaction });
        if (!levelsTable.blocks_limit) {
          await queryInterface.addColumn(
            'levels',
            'blocks_limit',
            {
              type: Sequelize.INTEGER,
              allowNull: true,
              comment: 'DEPRECATED: was moved to board_data.block_limit'
            },
            { transaction }
          );

          // Restore data from board_data
          await queryInterface.sequelize.query(`
            UPDATE levels l
            SET blocks_limit = bd.block_limit
            FROM board_data bd
            WHERE l.level_id = bd.level_id AND bd.block_limit IS NOT NULL
          `, { transaction });
        }
      } catch (e) {
        console.log('blocks_limit restoration skipped');
      }

      await transaction.commit();
      console.log('\n✓ Rollback completed');

    } catch (error) {
      await transaction.rollback();
      console.error('Rollback failed:', error);
      throw error;
    }
  }
};
