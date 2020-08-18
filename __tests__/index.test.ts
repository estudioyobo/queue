import {
  isInPublishingRange,
  validateTimeInput,
  start,
  IStartOptionsProps,
} from "../src/index";
const CronJob = require("cron").CronJob;
import * as MockDate from "mockdate";

const mockStart = jest.fn();
jest.mock("cron", () => {
  return {
    CronJob: jest.fn().mockImplementation(() => {
      return {
        start: mockStart,
      };
    }),
  };
});

describe("Publish range 09:00 - 21:00", () => {
  afterEach(() => {
    MockDate.reset();
  });
  it("should not publish on 09:00 (range start at 09:10)", () => {
    const now = new Date();
    now.setHours(9);
    now.setMinutes(0);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:10",
        endTime: "21:00",
      },
      now
    );
    expect(inRange).toBeFalsy();
  });
  it("should publish on 10:21", () => {
    const now = new Date();
    now.setHours(10);
    now.setMinutes(21);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "21:00",
      },
      now
    );
    expect(inRange).toBeTruthy();
  });
  it("should publish on 09:00", () => {
    const now = new Date();
    now.setHours(9);
    now.setMinutes(0);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "21:00",
      },
      now
    );
    expect(inRange).toBeTruthy();
  });
  it("should publish on 21:00", () => {
    const now = new Date();
    now.setHours(21);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "21:00",
      },
      now
    );
    expect(inRange).toBeTruthy();
  });
  it("should not publish on 07:21", () => {
    const now = new Date();
    now.setHours(7);
    now.setMinutes(21);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "21:00",
      },
      now
    );
    expect(inRange).toBeFalsy();
  });
  it("should not publish on 08:59", () => {
    const now = new Date();
    now.setHours(8);
    now.setMinutes(59);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "21:00",
      },
      now
    );
    expect(inRange).toBeFalsy();
  });
  it("should not publish on 21:01", () => {
    const now = new Date();
    now.setHours(21);
    now.setMinutes(1);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "21:00",
      },
      now
    );
    expect(inRange).toBeFalsy();
  });
});
describe("Publish range 09:00 - 01:00", () => {
  afterEach(() => {
    MockDate.reset();
  });
  it("should publish on 10:21", () => {
    const now = new Date();
    now.setHours(10);
    now.setMinutes(21);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "01:00",
      },
      now
    );
    expect(inRange).toBeTruthy();
  });
  it("should publish on 09:00", () => {
    const now = new Date();
    now.setHours(9);
    now.setMinutes(0);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "01:00",
      },
      now
    );
    expect(inRange).toBeTruthy();
  });
  it("should publish on 01:00", () => {
    const now = new Date();
    now.setHours(1);
    now.setMinutes(0);
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setDate(now.getDate() + 1);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "01:00",
      },
      now
    );
    expect(inRange).toBeTruthy();
  });
  it("should not publish on 07:21", () => {
    const now = new Date();
    now.setHours(7);
    now.setMinutes(21);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "01:00",
      },
      now
    );
    expect(inRange).toBeFalsy();
  });
  it("should not publish on 08:59", () => {
    const now = new Date();
    now.setHours(8);
    now.setMinutes(59);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "01:00",
      },
      now
    );
    expect(inRange).toBeFalsy();
  });
  it("should not publish on 01:01", () => {
    const now = new Date();
    now.setHours(1);
    now.setMinutes(1);
    now.setDate(now.getDate() + 1);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "01:00",
      },
      now
    );
    expect(inRange).toBeFalsy();
  });
  it("should not publish on 01:00 from yesterday", () => {
    const now = new Date();
    now.setHours(1);
    now.setMinutes(0);
    now.setMilliseconds(0);
    now.setSeconds(0);
    // now.setDate(now.getDate() + 1);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "01:00",
      },
      now
    );
    expect(inRange).toBeTruthy();
  });
  it("should publish on 00:25 and now is 00:25", () => {
    const now = new Date();
    now.setHours(0);
    now.setMinutes(25);
    now.setDate(now.getDate() + 1);
    MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "01:00",
      },
      now
    );
    expect(inRange).toBeTruthy();
  });
});
describe("Validate Time Input", () => {
  it("should passed silently with 00:00", () => {
    validateTimeInput("00:00");
  });
  it("should throw expection with 25:00", () => {
    expect(() => {
      validateTimeInput("25:00");
    }).toThrow("Parameter is not a valid time, e.g.: 10:25");
  });
  it("should throw expection with 23:59", () => {
    validateTimeInput("23:59");
  });
  it("should throw expection with 01:60", () => {
    expect(() => {
      validateTimeInput("01:60");
    }).toThrow("Parameter is not a valid time, e.g.: 10:25");
  });
  it("should throw expection with 325:650", () => {
    expect(() => {
      validateTimeInput("325:650");
    }).toThrow("Parameter is not a valid time, e.g.: 10:25");
  });
});
describe("Renew cron when ends", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // CronJob.mockClear();
  });
  it("should call Cron with startDate", () => {
    const options: IStartOptionsProps = {
      action: jest.fn(),
      onStart: jest.fn(),
      onStop: jest.fn(),
      startTime: "09:00",
      endTime: "21:00",
      interval: 10,
    };

    jest
      .spyOn(global.Date, "now")
      .mockImplementationOnce(() =>
        new Date("2020-04-12T09:30:00.135Z").valueOf()
      ) // Fist call start publishigRange
      .mockImplementationOnce(() =>
        new Date("2020-04-12T09:30:00.135Z").valueOf()
      ) // First iteration in timedQueue stringTime
      .mockImplementationOnce(() =>
        new Date("2020-04-12T09:30:00.135Z").valueOf()
      ) // First iteration in timedQueue publishigRange
      .mockImplementationOnce(() =>
        new Date("2020-04-12T23:30:00.135Z").valueOf()
      ) // Second iteration in timedQueue stringTime
      .mockImplementationOnce(() =>
        new Date("2020-04-12T23:30:00.135Z").valueOf()
      ); // Second iteration in timedQueue publishigRange

    const id = start(options);

    expect(options.onStart).toBeCalled();
    expect(options.action).toBeCalled();

    jest.runOnlyPendingTimers();

    expect(options.onStart).toHaveBeenCalledTimes(1);
    expect(options.action).toHaveBeenCalledTimes(1);
    expect(options.onStop).toHaveBeenCalledTimes(1);
    expect(CronJob).toBeCalled();
    expect(CronJob.mock.calls[0][0]).toEqual(
      new Date("2020-04-13T07:00:00.000Z")
    );
    expect(mockStart).toHaveBeenCalled();
  });
});
