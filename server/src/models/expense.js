'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Expense.belongsTo(models.ExpenseCategory,{
        foreignKey:"CategoryId",
        as:"expense"
      })

      Expense.belongsTo(models.User,{
        foreignKey:"CreatedBy",
        as:"user"
      })

      Expense.belongsTo(models.HouseShare, {
        foreignKey: 'houseShareId',
        as: 'houseShare'
      })
    }
  }
  Expense.init({
    price: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    isFinalised: DataTypes.BOOLEAN,
    amount:DataTypes.STRING

  }, {
    sequelize,
    modelName: 'Expense',
  });
  return Expense;
};