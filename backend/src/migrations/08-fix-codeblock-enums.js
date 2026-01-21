'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Change block_command enum values
        await queryInterface.sequelize.query(`
            ALTER TYPE "enum_codeblocks_block_command" ADD VALUE 'move_forward' BEFORE 'forward';
            ALTER TYPE "enum_codeblocks_block_command" ADD VALUE 'move_backward' BEFORE 'backward';
        `).catch(() => {
            // Postgres will throw error if values already exist, we can safely ignore
        });

        // Update existing records
        await queryInterface.sequelize.query(`
            UPDATE codeblocks SET block_command = 'move_forward' WHERE block_command = 'forward';
            UPDATE codeblocks SET block_command = 'move_backward' WHERE block_command = 'backward';
        `);

        // Change block_type enum values
        await queryInterface.sequelize.query(`
            ALTER TYPE "enum_codeblocks_block_type" ADD VALUE 'repeat' BEFORE 'loop';
        `).catch(() => {
            // Postgres will throw error if value already exists, we can safely ignore
        });

        // Update existing records
        await queryInterface.sequelize.query(`
            UPDATE codeblocks SET block_type = 'repeat' WHERE block_type = 'loop';
        `);
    },

    down: async (queryInterface, Sequelize) => {
        // This is a challenging rollback - we can only set values back
        await queryInterface.sequelize.query(`
            UPDATE codeblocks SET block_command = 'forward' WHERE block_command = 'move_forward';
            UPDATE codeblocks SET block_command = 'backward' WHERE block_command = 'move_backward';
            UPDATE codeblocks SET block_type = 'loop' WHERE block_type = 'repeat';
        `);
    }
};
