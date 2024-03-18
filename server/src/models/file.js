'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      File.belongsTo(models.HouseShare,{
        foreignKey:"houseShareId",
        as:"houseshare"
      })

      File.belongsTo(models.User,{
        foreignKey:"userId",
        as:"user"
      })
    }
  }
  File.init({
    name: DataTypes.STRING,
    size: DataTypes.STRING,
    type: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'File',
  });
  return File;
};