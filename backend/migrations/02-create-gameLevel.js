'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create Levels table
        await queryInterface.createTable('levels', {
            level_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            game_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            level_number: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            available_codeblocks: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            difficulty: {
                type: Sequelize.ENUM('easy', 'medium', 'hard'),
                defaultValue: 'easy',
                allowNull: false
            },
            level_layout: {
                type: Sequelize.JSON,
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

        // Create LevelProgress table (many-to-many through table)
        await queryInterface.createTable('level_progresses', {
            user_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id'
                },
                onDelete: 'CASCADE'
            },
            level_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'levels',
                    key: 'level_id'
                },
                onDelete: 'CASCADE'
            },
            best_score: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            attempts: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            completed: {
                type: Sequelize.ENUM('completed', 'in_progress', 'not_started'),
                allowNull: false,
                defaultValue: 'not_started'
            },
            last_played_at: {
                type: Sequelize.DATE,
                allowNull: true
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
        await queryInterface.addIndex('levels', ['game_id']);
        await queryInterface.addIndex('levels', ['difficulty']);
        await queryInterface.addIndex('level_progresses', ['user_id']);
        await queryInterface.addIndex('level_progresses', ['level_id']);
        await queryInterface.addIndex('level_progresses', ['completed']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('level_progresses');
        await queryInterface.dropTable('levels');
    }
};
