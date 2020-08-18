const CronJob = require("cron").CronJob;
const uuid = require("uuid/v4");

interface IPublishRange {
  startTime: string;
  endTime: string;
}

interface IQueueOptions extends IPublishRange {
  interval: number;
}

export interface IStartOptionsProps extends IQueueOptions {
  action: (queueInfo: IQueueInfo) => void;
  onStart?: (queueInfo: IQueueInfo) => void;
  onStop?: (queueInfo: IQueueInfo) => void;
}

interface IQueueInfo extends IQueueOptions {
  active: boolean;
  id: string;
  cron?: typeof CronJob;
}

interface IQueueMap {
  [key: string]: IQueueInfo;
}

let QUEUES: IQueueMap = {};

function minutesToMiliseconds(minutes: number): number {
  return minutes * 1000 * 60;
}

export function stringTimeToDate(
  stringTime: string,
  now = new Date(Date.now())
): Date {
  const time = new Date();
  const [hour, minute] = stringTime.split(":");
  time.setHours(parseInt(hour));
  time.setMinutes(parseInt(minute));
  time.setMonth(now.getMonth());
  time.setDate(now.getDate());
  time.setMilliseconds(0);
  time.setSeconds(0);
  if (time <= now) {
    time.setDate(time.getDate() + 1);
  }
  return time;
}

export function validateTimeInput(time: string) {
  const isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
    time
  );
  if (!isValid) {
    throw "Parameter is not a valid time, e.g.: 10:25";
  }
}

export function isInPublishingRange(
  { startTime, endTime }: IPublishRange,
  now = new Date(Date.now())
): boolean {
  const startDate = stringTimeToDate(startTime, now);
  const endDate = stringTimeToDate(endTime, now);

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
 * @param {object} options {startTime: String, endTime: String, interval: Number, action: function, onStart: function, onStop: function}
 * @returns {String} the queue identificator
 */
export function start(options: IStartOptionsProps): string {
  const id = uuid();
  const { action, onStart, onStop, ...rest } = options;
  validateTimeInput(options.startTime);
  validateTimeInput(options.endTime);
  QUEUES[id] = { id, active: true, ...rest };

  function timedQueue(firstTime = false) {
    return () => {
      const { startTime, endTime, interval, cron, active } = QUEUES[id];
      const startDate = stringTimeToDate(startTime);
      // startDate.setDate(startDate.getDate() + 1);
      if (firstTime) {
        if (onStart) {
          onStart(QUEUES[id]);
        }
      }
      // if (!cron) {
      //   QUEUES[id].cron = new CronJob(startDate, timedQueue(true));
      // }
      if (isInPublishingRange({ startTime, endTime })) {
        try {
          if (action) {
            action(QUEUES[id]);
          }
        } catch (error) {
          console.log("Error in queue", error);
        } finally {
          if (active) {
            const timeInterval = minutesToMiliseconds(interval);
            setTimeout(timedQueue(), timeInterval);
          }
        }
      } else {
        if (onStop) {
          onStop(QUEUES[id]);
        }
        // Start again in future
        QUEUES[id].cron = new CronJob(startDate, timedQueue(true));
        QUEUES[id].cron.start();
      }
    };
  }

  if (isInPublishingRange(options)) {
    timedQueue(true)();
  } else {
    const startDate = stringTimeToDate(options.startTime);
    QUEUES[id].cron = new CronJob(startDate, timedQueue(true));
    QUEUES[id].cron.start();
  }

  return id;
}

export function stop(id: string) {
  QUEUES[id].cron.stop();
  QUEUES[id].cron = null;
  QUEUES[id].active = false;
}

export function updateOptions(id: string, opts: IQueueOptions) {
  if (opts.startTime) {
    validateTimeInput(opts.startTime);
  }
  if (opts.endTime) {
    validateTimeInput(opts.endTime);
  }
  QUEUES[id] = { ...QUEUES[id], ...opts };
}
