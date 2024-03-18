'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Expenses',"isFinalised",{
      type:Sequelize.BOOLEAN,
      defaultValue:true,
      allowNull:false
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Expenses','isFinalised')
  }
};
