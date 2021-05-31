const cheerio = require('cheerio');
const axios = require('axios');
const config = require('./config');

const Exam = require('./db/models/exam');
const Conference = require('./db/models/conference');
const News = require('./db/models/news');

async function getPage(url) {
  let resp;

  try {
    resp = await axios.get(url); //get запрос страницы по url
  } catch (e) {
    console.log('error get page'); //не смогли загрузить
  }
  return resp.data; //возвращаем html страницы
} 

async function getConferenceInfo() { //информация по доступам к конференциям
  let content = await getPage(config.conferenceUrl); //получили html
  if(!content) { //если пусто, то возвращаем undefined
    reutrn; 
  }
  console.log('obtaining conference');
  const $ = cheerio.load(content); // оборачиваем в cherio чтобы можно было по селектору выбирать элементы страницы
  let data = $('.gdl-page-content table'); //выбираем данные по селектору
  let conferencies = [];
  data.each(async function() { //бежим по выбранным элементам и выбираем имя преподователя и данные по конферен-комнатам
    let el = $(this);
    let name = el.find($('tr:first-child')).text().trim();
    let data = el.find($('tr:nth-child(2)')).text().trim().replace(/Ссылка на .*/g, ''); //удаляем из текста часть с ссылкой
    let link = el.find($('a')).attr('href'); //получаем ссылку
    conferencies.push({
      name,
      data,
      link
    });
    let conf = await Conference.findOne({where: { name: name }}); // смотрим, есть ли объект где поле name === текущему name
    if(!conf) { // если нет, добавляем в базу
      Conference.create({
        name,
        data,
        link
      });
    }
  });
  return conferencies;
}

async function getEntranceInfo() { //информация о поступлении - время работы комиссии и ссылка на заявление
  let content = await getPage(config.statementUrl);
  if(!content) {
    reutrn;
  }
  console.log('obtaining entrance');
  const $ = cheerio.load(content);
  let time = $('.gdl-page-content div').text().trim(); // получем время работы комиссии
  let doc = $('.gdl-page-content a') //получаем список ссылок и ищем ссылку с текстом начинающимся на "Заявление для"
    .filter(function () {
      return $(this).text().includes('Заявление для '); //находим текст где есть заявление
    })
    .first();
  let link = doc.attr('href'); //ссылка на заявление
  let title = doc.text(); //текст ссылки на заявление
  return {
    time,
    doc: {
      link,
      title
    }
  }
}

async function getSchedule() { //получаем расписание для студентов
  let content = await getPage(config.schedule);
  if(!content) {
    reutrn;
  }
  console.log('obtaining schedule');
  const $ = cheerio.load(content);
  let schedules = $('.gdl-page-content a');
  let info = [];
  schedules.each(function() { //бежим по масииву ссылок и выбираем ссылки и текст
    let el = $(this);
    let title = el.text().trim(); //текст
    let link = el.attr('href'); //ссылка
    info.push({
      title,
      link
    })
  });
  return info;
}

async function getExam() { //информация по экзаменам
  let content = await getPage(config.examUrl);
  if(!content) {
    reutrn;
  }
  console.log('obtaining exam');
  const $ = cheerio.load(content);
  let examData = $('.gdl-page-content h3, .gdl-page-content a');
  let currentGroup;
  let groups = {};
  let examGroups = [];
  examData.each(function() {
    if(this.name === 'h3') { //если это элемент <h3>, то это группа предметов (например Русский язык)
      currentGroup = $(this).text().trim(); //назначаем ее текущей группой и все ссылки дальше под ней располагаются - это инфа для этой группы
      return;
    }
    let el = $(this); // элемент ссылки (<a>)
    let title = el.text().trim(); //текст
    let link = el.attr('href'); //ссылка
    if(!groups[currentGroup]) {
      groups[currentGroup] = []
    }
    groups[currentGroup].push({
      title,
      link
    });
  });
  Object.keys(groups).forEach(async (key) => {
    examGroups.push({
      group: key,
      items: groups[key]
    });
    let exam = await Exam.findOne({where: { group: key }}); //смотрим если есть ли объект с group === key в базе
    if(!exam) { // если нет, добавляем в базу
      Exam.create({
        group: key,
        items: JSON.stringify(groups[key])
      })
    }
  });
  return examGroups;
}

async function getReminder() { //памятка студенту
  let content = await getPage(config.infoUrl);
  if(!content) {
    reutrn;
  }
  console.log('obtaining reminder');
  const $ = cheerio.load(content);
  let reminder = $('.gdl-page-item');
  reminder = reminder.first().text(); //просто берем весь текст памятки
  return reminder;
}

async function getEntranceDocs() { //список документов для поступления
  let content = await getPage(config.docsUrl);
  if(!content) {
    reutrn;
  }
  console.log('obtaining entrance docs');
  const $ = cheerio.load(content);
  let docs = $('body > div.body-wrapper > div:nth-child(2) > div.content-wrapper.sidebar-included.left-sidebar > div > div.gdl-page-float-left > div.gdl-page-item > div > div > table > tbody')
  docs = docs.first().text(); //берем текст из таблицы
  if(!docs) {
    return;
  }
  docs = docs.replace(/[\r\n]+\s+/g, '\r\n'); //удаляем лишние переводы строки и длинные пробелы
  return docs;
}

async function getNews() { //последние новости
  let content = await getPage(config.newsUrl);
  if(!content) {
    reutrn;
  }
  console.log('obtaining news');
  const $ = cheerio.load(content);
  let news = $('.blog-item2'); //список новостей
  let newsContent = []
  news.each(async function() {
    let el = $(this);
    let title = el.find('.blog-thumbnail-title').first().text(); //получаем заголовок
    let link = el.find('.blog-thumbnail-title a').first().attr('href'); //ссылку
    let imageUrl = el.find('.blog-thumbnail-image img').first().attr('src'); //картинку
    let text = el.find('.blog-thumbnail-context .blog-thumbnail-content').first().text(); //сам текст новости
    newsContent.push({
      title,
      link,
      imageUrl,
      text
    })

    let news = await News.findOne({where: { link: link }}); //смотрим если есть ли объект с link === link в базе
    if(!news) { // если нет, добавляем новость
      News.create({
        title,
        link,
        imageUrl,
        text
      })
    }
  })
  return newsContent;
}

async function getFullData() { // вызываем все вышеперечисленные функции чтобы получить все данные
  let state;
  try {
    let entranceDocs = await getEntranceDocs();
    let reminder = await getReminder();
    let exams = await getExam();
    let schedule = await getSchedule();
    let entranceInfo = await getEntranceInfo();
    let conferenceInfo = await getConferenceInfo();
    let news = await getNews();
    state = {
      entranceDocs,
      reminder,
      exams,
      schedule,
      entranceInfo,
      conferenceInfo,
      news
    }
  } catch(e) {
    console.log(e); //если попали сюда, то какая то из функций завершилась с ошибкой
  }
  return state;
}

module.exports = {
  getFullData
}