let scheduler = require('node-schedule');

async function sheduleAction(timeSettings, callback) { // функция добавления действия по расписанию
    await scheduler.scheduleJob(timeSettings, async() => {
        await callback(); //вызываем коллбек который передали в параметре
    })
}

module.exports = sheduleAction;