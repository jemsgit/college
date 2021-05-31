
const Sequelize = require('sequelize');
// используем sequelize orm для работы с базой данных sqlite

// название базы данных college_db
// логин collegeadmin
// пароль secret1

// файл для храниния базы ./college_db.sqlite (в корне)

let sequelize = new Sequelize('college_db', 'collegeadmin', 'secret1', {
    dialect: 'sqlite',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  
    storage: './college_db.sqlite'
  });

module.exports = sequelize;