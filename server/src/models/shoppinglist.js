'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShoppingList extends Model {
    static associate(models) {

      ShoppingList.belongsToMany(models.User, { through: 'UsersShoppingLists' });

      ShoppingList.hasMany(models.ShoppingItem, {
        foreignKey: 'ShoppingListId',
        as: 'shoppingItems',
      })

      ShoppingList.belongsTo(models.HouseShare, {
        foreignKey: 'houseShareId',
        as: 'houseShare'
      })

    }
  }
  ShoppingList.init({
    uuid: DataTypes.STRING,
    name: DataTypes.STRING,
    isPrivate: DataTypes.BOOLEAN,
    CreatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ShoppingList',
  });
  return ShoppingList;
};