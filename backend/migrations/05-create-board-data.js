'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('board_data', {
            board_data_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            level_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: 'levels',
                    key: 'level_id'
                },
                onDelete: 'CASCADE'
            },
            grid_size: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 5
            },
            obstacles: {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: '[]'
            },
            start_position: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            goal_position: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            level_layout: {
                type: Sequelize.JSONB,
                allowNull: true,
                comment: 'Board layout configuration: dimensions, cat start position, goal, obstacles'
            },
            block_limit: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'Maximum number of code blocks allowed for this level'
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });

        // Add indexes
        await queryInterface.addIndex('board_data', ['level_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('board_data');
    }
};
