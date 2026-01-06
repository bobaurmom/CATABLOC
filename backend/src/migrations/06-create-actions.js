'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('actions', {
            action_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            session_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'sessions',
                    key: 'session_id'
                },
                onDelete: 'CASCADE'
            },
            codeblock_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'codeblocks',
                    key: 'codeblock_id'
                },
                onDelete: 'SET NULL'
            },
            action_type: {
                type: Sequelize.ENUM('execute', 'next', 'undo', 'reset', 'delete'),
                allowNull: false
            },
            action_result: {
                type: Sequelize.ENUM('success', 'failure'),
                allowNull: false
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
        await queryInterface.addIndex('actions', ['session_id']);
        await queryInterface.addIndex('actions', ['codeblock_id']);
        await queryInterface.addIndex('actions', ['action_type']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('actions');
    }
};
