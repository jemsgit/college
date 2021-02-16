let fs = require('fs');
let path = require('path');
let config = require('./config');

let { entranceInfoUrl, paymentInfoUrl, libraryUrl } = config; //ссылки на инфу цифры приема, платежах и бибилиотеку

const entranceDocsFileName = 'entrance';
const reminderFileName = 'reminder';

let store = {
  entranceInfo: null,
  studentReminder: null,
  exams: null,
  studentSchedule: null,
  conferenceInfo: null,
  news: [],
  paymentInfoUrl,
  libraryUrl,
}


async function processNewData(newStore){
  if(!newStore) {
    return;
  }

  let entranceFile = await saveTextAsFile(newStore.entranceDocs, entranceDocsFileName);
  let reminderFile = await saveTextAsFile(newStore.reminder, reminderFileName);

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

function saveTextAsFile(text, fileName) {
  return new Promise((res, rej) => {
    let file = path.resolve(__dirname, 'files', fileName + '.txt');
    console.log(file);
    fs.writeFile(file, text, (err) => {
      if(err) {
        console.log('cant write file');
        rej()
      }
      res(file)
    })
  })
}

function getData() {
  return store;
}

function getEntrance() {
  
  return store.entranceInfo ? store.entranceInfo.file : undefined;
}

function getReminder() {
  return store.studentReminder ? store.studentReminder.file : undefined;
}

module.exports = {
  processNewData,
  getData,
  getEntrance,
  getReminder
}