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

function validateTimeInput(time) {
  const isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
    time
  );
  if (!isValid) {
    throw "Parameter is not a valid time, e.g.: 10:25";
  }
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

/**
 *
 * @param {object} options {startTime: String, endTime: String, interval: Number}
 * @param {function} callback called every interval
 * @returns {String} the queue identificator
 */
function start(options, callback) {
  const id = uuid();
  validateTimeInput(options.startTime);
  validateTimeInput(options.endTime);
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
  if (opts.startTime) {
    validateTimeInput(opts.startTime);
  }
  if (opts.endTime) {
    validateTimeInput(opts.endTime);
  }
  QUEUES[id] = { ...QUEUES[id], ...opts };
}

module.exports = {
  start,
  stop,
  updateOptions,
  isInPublishingRange,
  validateTimeInput
};
