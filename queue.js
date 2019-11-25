const CronJob = require("cron").CronJob;

let CURRENT_CRON = null;
let QUEUE_STOPPED = false;

function minutesToMiliseconds(time) {
  return time * 10 * 60;
}

function stringTimeToDate(stringTime) {
  const time = new Date();
  const [hour, minute] = stringTime.split(":");
  time.setHours(hour);
  time.setMinutes(minute);
  time.setMilliseconds(0);
  return time;
}

function isInPublishingRange({ startTime, endTime }, now = new Date()) {
  const startDate = stringTimeToDate(startTime);
  const endDate = stringTimeToDate(endTime);

  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }
  if (now < startDate) {
    startDate.setDate(startDate.getDate() - 1);
    endDate.setDate(endDate.getDate() - 1);
  }
  return now <= endDate && now >= startDate;
}

function isInPublishingRange2({ startTime, endTime }, now = new Date()) {
  const parseStart = startTime.split(":").map(s => Number(s));
  const parseEnd = endTime.split(":").map(s => Number(s));
  const nowDate = { hour: now.getHours(), minute: now.getMinutes() };
  const startDate = { hour: parseStart[0], minute: parseStart[1] };
  const endDate = { hour: parseEnd[0], minute: parseEnd[1] };

  // Check hours when end date is after midnight
  if (endDate.hour < startDate.hour) {
    // Date between start and midnight
    if (nowDate.hour >= startDate.hour) {
      return true;
      // same hour
    } else if (nowDate.hour >= 0 && nowDate.hour <= endDate.hour) {
      // minutes in range
      if (nowDate.hour === endDate.hour && nowDate.minute > endDate.minute) {
        return false;
      }
      return true;
    }
  } else {
    // In range
    if (nowDate.hour < endDate.hour && nowDate.hour > startDate.hour) {
      return true;
      // same hour
    } else if (
      nowDate.hour === endDate.hour ||
      nowDate.hour === startDate.hour
    ) {
      // minutes in range
      if (
        nowDate.minute > endDate.minute ||
        nowDate.minute < startDate.minute
      ) {
        return false;
      } else {
        return true;
      }
    }
  }
}

function startQueue({ startTime, endTime, interval }, callback) {
  // Possible problems:
  // - If want to change options

  QUEUE_STOPPED = false;

  function timedQueue() {
    const startDate = stringTimeToDate(startTime);
    startDate.setDate(startDate.getDate() + 1);
    if (!CURRENT_CRON) {
      CURRENT_CRON = new CronJob(startDate, timedQueue);
    }
    if (isInPublishingRange({ startTime, endTime })) {
      try {
        callback();
      } catch (error) {
        console.log("Error in queue", error);
      } finally {
        if (!QUEUE_STOPPED) {
          const timeInterval = minutesToMiliseconds(interval);
          setTimeout(timedQueue, timeInterval);
        }
      }
    } else {
      CURRENT_CRON.start();
    }
  }

  if (isInPublishingRange({ startTime, endTime })) {
    timedQueue();
  } else {
    const startDate = stringTimeToDate(startTime);
    CURRENT_CRON = new CronJob(startDate, timedQueue);
    CURRENT_CRON.start();
  }
}

function stopQueue() {
  CURRENT_CRON.stop();
  CURRENT_CRON = null;
  QUEUE_STOPPED = true;
}

module.exports = {
  startQueue,
  stopQueue,
  isInPublishingRange
};
