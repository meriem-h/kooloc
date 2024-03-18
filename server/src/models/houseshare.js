'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HouseShare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      HouseShare.hasMany(models.User, {
        foreignKey: 'houseShareId',
        as: 'users',
      }); 


      HouseShare.hasMany(models.Event, {
        foreignKey: 'houseShareId',
        as: 'events',
      });

      HouseShare.hasMany(models.ShoppingList, {
        foreignKey: 'houseShareId',
        as: 'shoppinglists',
      });

      HouseShare.hasMany(models.Expense, {
        foreignKey: 'houseShareId',
        as: 'expenses',
      });

      HouseShare.hasMany(models.ExpenseCategory, {
        foreignKey: 'houseShareId',
        as: 'expenseCategory',
      });
      
      HouseShare.hasMany(models.Poll, {
        foreignKey: 'houseShareId',
        as: 'polls',
      })
      
      HouseShare.hasMany(models.Chatroom, {
        foreignKey: 'houseShareId',
        as: 'chatrooms',
      })

      HouseShare.hasMany(models.File, {
        foreignKey: 'houseShareId',
        as: 'files',
      })

    }
  }
  HouseShare.init({
    name: DataTypes.STRING,
    uui: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HouseShare',
  });
  return HouseShare;
};