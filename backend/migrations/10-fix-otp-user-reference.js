'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Drop the incorrect foreign key constraint
        try {
            await queryInterface.removeConstraint('otp', 'otp_user_id_fkey');
        } catch (err) {
            // Constraint might not exist or have a different name
            console.log('Note: Could not find otp_user_id_fkey constraint');
        }

        // Add the correct foreign key reference
        await queryInterface.addConstraint('otp', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'otp_user_id_fkey',
            references: {
                table: 'users',
                field: 'user_id'
            },
            onDelete: 'CASCADE'
        }).catch(() => {
            // Constraint might already exist
            console.log('Note: Foreign key constraint may already exist');
        });
    },

    down: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.removeConstraint('otp', 'otp_user_id_fkey');
        } catch (err) {
            console.log('Note: Could not remove constraint');
        }
    }
};
