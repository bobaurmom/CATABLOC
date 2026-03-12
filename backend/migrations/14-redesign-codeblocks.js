'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const columns = await queryInterface.describeTable('codeblocks', { transaction });

      // game_id: optional FK to games
      if (!columns.game_id) {
        await queryInterface.addColumn(
          'codeblocks',
          'game_id',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: 'games',
              key: 'game_id',
            },
            onDelete: 'SET NULL',
          },
          { transaction }
        );
      }

      // level_id: optional FK to levels (palette per-level)
      if (!columns.level_id) {
        await queryInterface.addColumn(
          'codeblocks',
          'level_id',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: 'levels',
              key: 'level_id',
            },
            onDelete: 'CASCADE',
          },
          { transaction }
        );
      }

      // name: human-friendly block name
      if (!columns.name) {
        await queryInterface.addColumn(
          'codeblocks',
          'name',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'Unnamed block',
          },
          { transaction }
        );
      }

      // description: optional
      if (!columns.description) {
        await queryInterface.addColumn(
          'codeblocks',
          'description',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction }
        );
      }

      // type: semantic category for UI
      if (!columns.type) {
        await queryInterface.addColumn(
          'codeblocks',
          'type',
          {
            type: Sequelize.ENUM(
              'movement',
              'loop',
              'condition',
              'procedure',
              'control'
            ),
            allowNull: false,
            defaultValue: 'movement',
          },
          { transaction }
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove added columns in reverse-ish order
      await queryInterface.removeColumn('codeblocks', 'type', { transaction });
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_codeblocks_type";',
        { transaction }
      );

      await queryInterface.removeColumn('codeblocks', 'description', { transaction });
      await queryInterface.removeColumn('codeblocks', 'name', { transaction });
      await queryInterface.removeColumn('codeblocks', 'level_id', { transaction });
      await queryInterface.removeColumn('codeblocks', 'game_id', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

