const path = require('path');
const express = require('express');
const cors = require('cors')
const scheduler = require('./scheduler');
const scraper = require('./scraper');
const store = require('./store');
require('./db/models/index');

const port = 3000;

async function scrapData() {
  let fullData = await scraper.getFullData(); //получаем данные
  await store.processNewData(fullData); //сохраняем в стейт приложения
}

store.loadDataFormDb(); // загружаем часть данных в стейт приложения из базы данных

scrapData(); // получаем информацию с сайта при запуске
scheduler('00 23 * * *', async function() {  //потом каждый день в 23 00 запускаем функцию получения информации с сайта
  await scrapData();
})

let app = express(); //заводим сервер
app.use(cors()); //чтобы можно было запрашивать данные с другого сервера (для девелопмент версии, когда используем дев сервер)

app.use(express.static(path.resolve(__dirname, '../dist'))); //сервер раздает статические файлы UI приложения (html, скрипты и стили)

app.get('/api/data', function(req, res) { //сервер обрабатывает запрос на получение данных
  res.json(store.getData()); //возвращаем JSON
});

app.get('/api/reminder', function(req, res) { //сервер обрабатывает запрос на скачивание файла с Памяткой студета
  res.download(store.getReminder());
});

app.get('/api/entrance', function(req, res) { //сервер обрабатывает запрос на скачивание файла с инфой для поступления
  res.download(store.getEntrance());
});

app.get('*', (req,res) =>{
  res.sendFile(path.resolve(__dirname, '../dist/index.html')); // на все остальные запросы отдаем файл index.html с React приложением
});


app.listen(port, () => { //запускаем сервер
  console.log(`App listening at http://localhost:${port}`)
})
