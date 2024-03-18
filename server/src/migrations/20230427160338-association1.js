'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('ShoppingLists', 'houseShareId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'HouseShares',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    })

    await queryInterface.addColumn('Expenses', 'houseShareId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'HouseShares',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    })

    await queryInterface.addColumn('ExpenseCategories', 'houseShareId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'HouseShares',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('ShoppingLists', 'houseShareId');
    await queryInterface.removeColumn('Expenses', 'houseShareId');
    await queryInterface.removeColumn('ExpenseCategories', 'houseShareId');

  }
};
