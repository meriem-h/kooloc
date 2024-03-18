'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Poll extends Model {
    static associate(models) {
      Poll.hasMany(models.Suggestion, {
        foreignKey: 'pollId',
        as: 'choices',
      });

      Poll.belongsTo(models.HouseShare,{
        foreignKey:"houseShareId",
        as:"houseshare"
      })

      Poll.belongsTo(models.User,{
        foreignKey:"userId",
        as:"user"
      })
    }
  }
  Poll.init({
    question: DataTypes.STRING,
    houseshareId:DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Poll',
  });
  return Poll;
};