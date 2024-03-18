'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('ExpenseCategories','primaryColor',{
      type:Sequelize.STRING
    })
    queryInterface.addColumn('ExpenseCategories','secondaryColor',{
      type:Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('ExpenseCategories','primaryColor')
    queryInterface.removeColumn('ExpenseCategories','secondaryColor')
  }
};
