const path = require('path');
const express = require('express');
const cors = require('cors')
const scheduler = require('./scheduler');
const scraper = require('./scraper');
const store = require('./store');

const port = 3000;

async function scrapData() {
  let fullData = await scraper.getFullData(); //получаем данные
  await store.processNewData(fullData); //сохраняем в стейт приложения
}

scrapData(); // получаем информацию с сайта
scheduler('00 23 * * *', async function() {  //каждый день в 23 00 запускаем функцию получения информации с сайта
  await scrapData();
})

let app = express(); //заводим сервер
app.use(cors()); //cross origin request

app.use(express.static(path.resolve(__dirname, '../dist'))); //сервер раздает статические файлы UI приложения (html, скрипты и стили)

app.get('/api/data', function(req, res) { //сервер обрабатывает запрос на получение данных
  res.json(store.getData());
});

app.get('/api/reminder', function(req, res) { //сервер обрабатывает запрос на получение данных
  res.download(store.getReminder());
});

app.get('/api/entrance', function(req, res) { //сервер обрабатывает запрос на получение данных
  res.download(store.getEntrance());
});

app.get('*', (req,res) =>{
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});



app.listen(port, () => { //запускаем сервер
  console.log(`Example app listening at http://localhost:${port}`)
})

