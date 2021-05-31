const { DataTypes } = require('sequelize');
const sequelize = require('../db');

//модель данных для экзаменов
// group - строка (не может быть null)
// items - строка (JSON объект для хранения инфы по экзаменам)


const Exam = sequelize.define('Exam', {
  group: {
    type: DataTypes.STRING,
    allowNull: false
  },
  items: {
    type: DataTypes.STRING
  }
});

module.exports = Exam;