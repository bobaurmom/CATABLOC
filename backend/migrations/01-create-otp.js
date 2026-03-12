'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('otp', {
      otp_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        },
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      code: {
        type: Sequelize.STRING(6),
        allowNull: false,
        validate: {
          len: [6, 6],
          isNumeric: true
        }
      },
      otp_type: {
        type: Sequelize.ENUM('email_verification', 'password_reset'),
        allowNull: false
      },
      expired_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expired: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 3
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('otp', ['email', 'otp_type']);
    await queryInterface.addIndex('otp', ['expired_at']);
    await queryInterface.addIndex('otp', ['user_id']);
    await queryInterface.addIndex('otp', ['expired']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('otp');
  }
};
