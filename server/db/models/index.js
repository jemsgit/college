const News = require('./news');
const Conference = require('./conference');
const Exam = require('./exam');

//синхронизируем таблица
// если вызвать sync({force: true}), то таблица очистится

News.sync();
Conference.sync();
Exam.sync();