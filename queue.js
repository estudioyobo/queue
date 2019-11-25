const CronJob = require("cron").CronJob;

function getIntervalTime(time) {
  return time * 1000 * 60;
}

function stringTimeToDate(stringTime) {
  const time = new Date();
  const [hour, minute] = stringTime.split(":");
  time.setHours(hour);
  time.setMinutes(minute);
  return time;
}

function isInPublishingRange({ startTime, endTime }, now = new Date()) {
  const aTime = stringTimeToDate(startTime);
  const bTime = stringTimeToDate(endTime);
  if (bTime < aTime) {
    bTime.setDate(bTime.getDate() + 1);
  }
  if (now < aTime) {
    aTime.setDate(aTime.getDate() - 1);
    bTime.setDate(bTime.getDate() - 1);
  }
  console.log(
    `aTime:${aTime}\nbTime:${bTime}\nnow:${now}\nresult:${now <= bTime &&
      now >= aTime}`
  );
  return now <= bTime && now >= aTime;
}

async function startQueue({ startTime, endTime, time }, callback) {
  // Possible problems:
  // - If want to change options
  // - How to stop a queue?

  async function timedQueue() {
    if (isInPublishingRange({ startTime, endTime })) {
      try {
        callback();
      } catch (error) {
        console.log("Error in queue", error);
      } finally {
        const timeInterval = getIntervalTime(time);
        setTimeout(timedQueue, timeInterval);
      }
    } else {
      const startDate = stringTimeToDate(channel.startTime);
      startDate.setDate(startDate.getDate() + 1);
      new CronJob(startDate, timedQueue).start();
    }
  }

  if (isInPublishingRange({ startTime, endTime })) {
    timedQueue();
  } else {
    const startDate = stringTimeToDate(startTime);
    new CronJob(startDate, timedQueue).start();
  }
}

module.exports = {
  startQueue,
  isInPublishingRange
};
