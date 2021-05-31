const { DataTypes } = require('sequelize');
const sequelize = require('../db');

//модель данных для конференц комнат
//name - строка (не может быть null)
//data - строка
//link - строка

const Conference = sequelize.define('Conference', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.STRING
  },
  link: {
    type: DataTypes.STRING
  }
});

module.exports = Conference;