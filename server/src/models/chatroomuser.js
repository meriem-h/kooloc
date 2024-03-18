'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatroomUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChatroomUser.belongsTo(models.Chatroom,{
        foreignKey:"ChatroomId",
        as:"chatroom"
      })

      ChatroomUser.belongsTo(models.User,{
        foreignKey:"UserId",
        as:"user"
      })
    }
  }
  ChatroomUser.init({
    lastRead: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ChatroomUser',
  });
  return ChatroomUser;
};