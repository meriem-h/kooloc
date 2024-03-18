'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ShoppingItems', 'ShoppingListId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'ShoppingLists',
        key: 'id',
      },
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ShoppingItems', 'ShoppingListId');

  }
};
