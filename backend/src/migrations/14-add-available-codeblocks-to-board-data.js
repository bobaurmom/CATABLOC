'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('board_data', 'available_codeblocks', {
            type: Sequelize.TEXT,
            allowNull: true,
            defaultValue: '[]',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('board_data', 'available_codeblocks');
    }
};
