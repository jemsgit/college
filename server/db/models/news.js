const { DataTypes } = require('sequelize');
const sequelize = require('../db');

//модель данных для новостей
// title - строка (не может быть null)
// link - строка 
// imageUrl - строка
// text - строка

var News = sequelize.define('News', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  text: {
    type: DataTypes.STRING
  },
});

console.log(News);

module.exports = News;