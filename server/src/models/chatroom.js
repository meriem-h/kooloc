'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chatroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chatroom.belongsToMany(models.User, { through: 'ChatroomUser' } );

      // Chatroom.hasMany(models.ChatroomUser,{
      //   foreignKey:"chatroomId",
      //   as:"userList"
      // })

      Chatroom.hasMany(models.ChatroomMessage,{
        foreignKey:"chatroomId",
        as:"messages"
      })

      Chatroom.belongsTo(models.HouseShare, {
        foreignKey: 'houseShareId',
        as: 'houseShare'
      })
    }
  }
  Chatroom.init({
    isPrivate: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    lastMessageTime: DataTypes.DATE,
    CreatedBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Chatroom',
  });
  return Chatroom;
};