'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
      })
      Event.belongsTo(models.HouseShare, {
        foreignKey: "houseShareId",
        as: "houseShare"
      })
    }
  }
  Event.init({
    title: DataTypes.STRING,
    start: DataTypes.STRING,
    end: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};