'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatroomMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChatroomMessage.belongsTo(models.Chatroom,{
        foreignKey:"chatroomId",
        as:"chatroom"
      })

      ChatroomMessage.belongsTo(models.User,{
        foreignKey:"createdBy",
        as:"user"
      })
    }
  }
  ChatroomMessage.init({
    active: DataTypes.BOOLEAN,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChatroomMessage',
  });
  return ChatroomMessage;
};