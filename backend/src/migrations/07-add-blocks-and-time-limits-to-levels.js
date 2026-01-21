'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('levels', 'blocks_limit', {
            type: Sequelize.INTEGER,
            allowNull: true,
            after: 'level_layout'
        });
        await queryInterface.addColumn('levels', 'time_limit', {
            type: Sequelize.INTEGER,
            allowNull: true,
            after: 'blocks_limit'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('levels', 'blocks_limit');
        await queryInterface.removeColumn('levels', 'time_limit');
    }
};
