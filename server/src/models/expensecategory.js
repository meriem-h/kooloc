'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExpenseCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ExpenseCategory.hasMany(models.Expense, {
        foreignKey: 'CategoryId',
        as: 'expenses',
      })

      ExpenseCategory.belongsTo(models.HouseShare, {
        foreignKey: 'houseShareId',
        as: 'houseShare'
      })
    }
  }
  ExpenseCategory.init({
    name: DataTypes.STRING,
    primaryColor: DataTypes.STRING,
    secondaryColor: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ExpenseCategory',
  });
  return ExpenseCategory;
};