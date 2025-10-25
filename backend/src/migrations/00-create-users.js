'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            user_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            username: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            password_hash: {
                type: Sequelize.STRING(255),
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
        await queryInterface.addIndex('Users', ['email']);
        await queryInterface.addIndex('Users', ['username']);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    },

};