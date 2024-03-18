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
    await queryInterface.addColumn('ShoppingLists', 'CreatedBy', {
      type: Sequelize.INTEGER
    })

    await queryInterface.addColumn('ShoppingLists', 'isPrivate', {
      type: Sequelize.BOOLEAN
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('ShoppingLists', 'CreatedBy');
    await queryInterface.removeColumn('ShoppingLists', 'isPrivate');
  }
};
