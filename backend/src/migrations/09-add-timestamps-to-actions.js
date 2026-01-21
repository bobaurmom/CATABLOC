'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Check if columns already exist before adding
        const tableDescription = await queryInterface.describeTable('actions');
        
        if (!tableDescription.created_at) {
            await queryInterface.addColumn('actions', 'created_at', {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            });
        }
        
        if (!tableDescription.updated_at) {
            await queryInterface.addColumn('actions', 'updated_at', {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDescription = await queryInterface.describeTable('actions');
        
        if (tableDescription.created_at) {
            await queryInterface.removeColumn('actions', 'created_at');
        }
        
        if (tableDescription.updated_at) {
            await queryInterface.removeColumn('actions', 'updated_at');
        }
    }
};
