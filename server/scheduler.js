let scheduler = require('node-schedule');

async function sheduleAction(timeSettings, callback) {
    await scheduler.scheduleJob(timeSettings, async() => {
        await callback();
    })
}

module.exports = sheduleAction;