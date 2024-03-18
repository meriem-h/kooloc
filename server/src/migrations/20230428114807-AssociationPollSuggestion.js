'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Suggestions', 'pollId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Polls',
        key: 'id',
      },
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("Suggestions","pollId")
  }
};
