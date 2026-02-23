'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('board_data', 'game_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1, // Default value for existing rows
            references: {
                model: 'games',
                key: 'game_id'
            },
            onDelete: 'CASCADE'
        });

        // Add index for better query performance
        await queryInterface.addIndex('board_data', ['game_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('board_data', ['game_id']);
        await queryInterface.removeColumn('board_data', 'game_id');
    }
};
