'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Step 1: Adding level_layout to board_data table...');
      
      const boardColumns = await queryInterface.describeTable('board_data', { transaction });
      
      // Add level_layout if missing
      if (!boardColumns.level_layout) {
        await queryInterface.addColumn(
          'board_data',
          'level_layout',
          {
            type: Sequelize.JSONB,
            allowNull: true,
            comment: 'Board layout configuration: dimensions, cat start position, goal, obstacles'
          },
          { transaction }
        );
        console.log('  ✓ Added level_layout column to board_data table');
      } else {
        console.log('  ✓ level_layout column already exists in board_data table');
      }

      await transaction.commit();
      console.log('\n✓ Migration completed successfully!');
      console.log('  - level_layout added to board_data (single source of truth)');

    } catch (error) {
      await transaction.rollback();
      console.error('Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Rolling back level_layout addition...');
      
      const boardColumns = await queryInterface.describeTable('board_data', { transaction });
      
      if (boardColumns.level_layout) {
        await queryInterface.removeColumn('board_data', 'level_layout', { transaction });
        console.log('  ✓ Removed level_layout column from board_data table');
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
