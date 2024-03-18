'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShoppingItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ShoppingItem.belongsTo(models.ShoppingList,{
        foreignKey:"ShoppingListId",
        as:"shoppingList"
      })

      ShoppingItem.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator',
      });
    }
  }
  ShoppingItem.init({
    content: DataTypes.STRING,
    isComplete: DataTypes.BOOLEAN,
    isOnSpend:DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'ShoppingItem',
  });
  return ShoppingItem;
};