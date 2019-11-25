const CronJob = require("cron").CronJob;
const uuid = require("uuid/v4");

let QUEUES = {};

function minutesToMiliseconds(minutes) {
  return minutes * 1000 * 60;
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

/**
 *
 * @param {object} options {startTime: String, endTime: String, interval: Number}
 * @param {function} callback called every interval
 * @returns {String} the queue identificator
 */
function start(options, callback) {
  // Possible problems:
  // - If want to change options

  const id = uuid();
  QUEUES[id] = { active: true, ...options };

  function timedQueue() {
    const { startTime, endTime, interval, cron, active } = QUEUES[id];
    const startDate = stringTimeToDate(startTime);
    startDate.setDate(startDate.getDate() + 1);
    if (!cron) {
      QUEUES[id].cron = new CronJob(startDate, timedQueue);
    }
    if (isInPublishingRange({ startTime, endTime })) {
      try {
        callback();
      } catch (error) {
        console.log("Error in queue", error);
      } finally {
        if (active) {
          const timeInterval = minutesToMiliseconds(interval);
          setTimeout(timedQueue, timeInterval);
        }
      }
    } else {
      cron.start();
    }
  }

  if (isInPublishingRange(options)) {
    timedQueue();
  } else {
    const startDate = stringTimeToDate(options.startTime);
    QUEUES[id].cron = new CronJob(startDate, timedQueue);
    QUEUES[id].cron.start();
  }

  return id;
}

function stop(id) {
  QUEUES[id].cron.stop();
  QUEUES[id].cron = null;
  QUEUES[id].active = false;
}

function updateOptions(id, opts) {
  QUEUES[id] = { ...QUEUES[id], ...opts };
}

module.exports = {
  start,
  stop,
  updateOptions,
  isInPublishingRange
};
