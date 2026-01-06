'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('codeblocks', {
            codeblock_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            block_command: {
                type: Sequelize.ENUM('forward', 'backward', 'turn_left', 'turn_right', 'light'),
                allowNull: false
            },
            block_type: {
                type: Sequelize.ENUM('movement', 'loop', 'while', 'condition', 'procedure'),
                allowNull: false
            }
        });

        // Add indexes
        await queryInterface.addIndex('codeblocks', ['block_command']);
        await queryInterface.addIndex('codeblocks', ['block_type']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('codeblocks');
    }
};
