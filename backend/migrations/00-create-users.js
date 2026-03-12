'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            user_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            username: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            password_hash: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('pending', 'active', 'suspended'),
                allowNull: false,
                defaultValue: 'pending'
            },
            total_exp: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            current_streak: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            profile_pic: {
                type: Sequelize.STRING(255),
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
        await queryInterface.addIndex('users', ['email']);
        await queryInterface.addIndex('users', ['username']);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('users');
    },

};