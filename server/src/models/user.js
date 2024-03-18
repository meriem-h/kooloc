'use strict';
const {
  Model
} = require('sequelize');

const validator = require('validator');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      User.belongsTo(models.HouseShare, {
        foreignKey: 'houseShareId',
        as: 'houseShare',
      });

      User.belongsToMany(models.ShoppingList, { through: 'UsersShoppingLists' } );

      User.hasMany(models.ShoppingItem, {
        foreignKey: 'creatorId',
        as: 'shoppingItems',
      });

      User.hasMany(models.Expense, {
        foreignKey: 'CreatedBy',
        as: 'expenses',
      })


      
      User.hasMany(models.Event,{
        foreignKey: 'userId',
        as: 'events',
      })


      User.hasMany(models.Poll, {
        foreignKey: 'userId',
        as: 'polls',
      })

      User.belongsToMany(models.Chatroom, { through: 'ChatroomUser' } );

      User.hasMany(models.ChatroomMessage, {
        foreignKey: 'createdBy',
        as: 'messages',
      })

      // User.hasMany(models.ChatroomUser, {
      //   foreignKey: 'userInChatroom',
      //   as: 'chatroomsState',
      // })
      
      User.hasMany(models.File, {
        foreignKey: 'userId',
        as: 'files',
      })
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le prenom ne peut pas être vide" },
        len: { args: [2, 50], msg: "Le prenom doit contenir entre 2 et 50 caractères" }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le nom ne peut pas être vide" },
        len: { args: [2, 50], msg: "Le nom doit contenir entre 2 et 50 caractères" }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "L'email ne peut pas être vide" },
        isEmail: { msg: "L'adresse email doit être valide" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [8, 225], msg: "Le mot de passe doit contenir 8 caractères minimum" },
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
