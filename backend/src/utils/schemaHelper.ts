import sequelize from '../config/sequelize';
import { QueryInterface } from 'sequelize';

/**
 * Simple database helper to ensure all schema changes are applied
 */
export const ensureSchemaUpdates = async (): Promise<void> => {
  try {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();

    // Check if available_codeblocks column exists
    const boardDataTable = await queryInterface.describeTable('board_data');
    
    if (!boardDataTable['available_codeblocks']) {
      console.log('📋 Adding available_codeblocks column to board_data...');
      await queryInterface.addColumn('board_data', 'available_codeblocks', {
        type: require('sequelize').DataTypes.TEXT,
        allowNull: true,
        defaultValue: '[]',
      });
      console.log('✓ Column available_codeblocks added successfully');
    } else {
      console.log('✓ Column available_codeblocks already exists');
    }
  } catch (error: any) {
    console.error('Error ensuring schema updates:', error.message);
    // Don't fail completely - the column might exist in a way we can't detect
    if (!error.message.includes('already exists')) {
      throw error;
    }
  }
};
