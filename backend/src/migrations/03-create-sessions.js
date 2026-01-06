'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('sessions', {
            session_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            level_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'levels',
                    key: 'level_id'
                },
                onDelete: 'CASCADE'
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id'
                },
                onDelete: 'CASCADE'
            },
            started_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            ended_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            is_completed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }
        });

        // Add indexes
        await queryInterface.addIndex('sessions', ['level_id']);
        await queryInterface.addIndex('sessions', ['user_id']);
        await queryInterface.addIndex('sessions', ['is_completed']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('sessions');
    }
};
