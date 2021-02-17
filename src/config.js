const config = {
  baseUrl: 'http://127.0.0.1:3000/api/data', //ведет на локальный сервер (если использовать в продакшне нужно заменить на url сервера)
  reminder: 'http://127.0.0.1:3000/api/reminder', //url для получения файла Памятки студента
  entrance: 'http://127.0.0.1:3000/api/entrance', //url для получения файла инфы о поступлении
}

export default config;