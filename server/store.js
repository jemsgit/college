let fs = require('fs');
let path = require('path');
let config = require('./config');

let News = require('./db/models/news')
let Conference = require('./db/models/conference')
let Exam = require('./db/models/exam')

let { entranceInfoUrl, paymentInfoUrl, libraryUrl } = config; //ссылки на инфу цифры приема, платежах и бибилиотеку

const entranceDocsFileName = 'entrance'; //имя файла для инфы о поступлении
const reminderFileName = 'reminder'; //имя файла для памятки

let store = {
  entranceInfo: null,
  studentReminder: null,
  exams: null,
  studentSchedule: null,
  conferenceInfo: null,
  news: [],
  paymentInfoUrl,
  libraryUrl,
} //изначальный Store приложения


async function processNewData(newStore){ // обрабатываем данные с сайта чтобы сохранить их в приложении
  if(!newStore) {
    return;
  }

  let entranceFile = await saveTextAsFile(newStore.entranceDocs, entranceDocsFileName); //сохраняем инфу о поступлении в файл
  let reminderFile = await saveTextAsFile(newStore.reminder, reminderFileName); //сохраняем памятку студента в файл

  store = {
    ...store,
    entranceInfo: {
      docs: newStore.entranceDocs, //текст о необходимых документа
      file: entranceFile, //файл с текстом о документах
      countInfoLink: entranceInfoUrl, //ссылка на цифры приема
      info: { //время работы комиссии, ссылка на заявление
        ...newStore.entranceInfo
      }
    },
    studentReminder: { //памятка студента
      file: reminderFile
    },
    news: newStore.news, // последние новости
    exams: newStore.exams, //инфа о экзаменах
    studentSchedule: newStore.schedule, //расписание
    conferenceInfo: newStore.conferenceInfo //ифна о конференц-комнатах
  }
}

function saveTextAsFile(text, fileName) { //сохранение файла с текстом
  return new Promise((res, rej) => { //оборачиваем в промис
    let file = path.resolve(__dirname, 'files', fileName + '.txt'); //получаем путь к файлу
    fs.writeFile(file, text, (err) => {
      if(err) { //если ошибка при сохранении
        console.log('cant write file');
        rej();
      }
      res(file); //возвращаем результат сохранения файла - путь
    })
  })
}

function getData() {
  return store; // все данные приложения
}

function getEntrance() { //получение файла с инфой о поступлении
  return store.entranceInfo ? store.entranceInfo.file : undefined;
}

function getReminder() { //получение файла с памяткой студента
  return store.studentReminder ? store.studentReminder.file : undefined;
}

async function loadDataFormDb() {
  let news = await News.findAll({raw: true}); //получаем новости из БД
  let conferences = await Conference.findAll({raw: true}); //получаем конференции из БД
  let exams = await Exam.findAll({raw: true}); //получаем экзамены из БД
  exams.forEach(exam => {
    exam.items = JSON.parse(exam.items); //переводим инфу по экзаменам для группы из JSON и обычный JS объект
  });
  store = {
    ...store,
    news,
    conferenceInfo: conferences,
    exams
  }
  return store;
}

module.exports = {
  processNewData,
  getData,
  getEntrance,
  getReminder,
  loadDataFormDb
}