# College App

Мобильный портал саратовского колледжа.
Собирает информацию с сайта раз в день и позволяет посмотреть это в приложении.
После открытии сайта на мобильном телефоне сайт предложит добавит сайт на главное окно телефона
За это отвечает файл manifest.json (где прописаны иконки приложения, тип приложения, стартовый урл и цветовая схема) и sw.js (который занимается кешированием данных и позволяет смотреть сайт оффлайн)

![](https://telegra.ph/file/c9a844444680a5b4315ce.png)

## Установка

```bash
npm i
```

## Сборка

Собирается вебпаком - выходные файлы лежат в папке dist, которую раздает после запуска express server

```
npm run build
```

## запуск

```
npm run start
```

После запуска сервер начнет собирать данные с сайта и через минуту уже можно увидеть и на сайте
Сайт доступе по урлу [http://localhost:3000](http://localhost:3000)

