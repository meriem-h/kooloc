'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Polls', 'houseshareId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'HouseShares',
        key: 'id',
      },
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn("Polls","houseshareId")
  }
};
