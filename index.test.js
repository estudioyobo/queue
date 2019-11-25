const { isInPublishingRange } = require("./queue");
const MockDate = require("mockdate");
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
        endTime: "21:00"
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
        endTime: "21:00"
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
        endTime: "21:00"
      },
      now
    );
    expect(inRange).toBeTruthy();
  });
  it("should publish on 21:00", () => {
    const now = new Date();
    now.setHours(21);
    now.setMinutes(0);
    now.setMilliseconds(0);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "21:00"
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
        endTime: "21:00"
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
        endTime: "21:00"
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
        endTime: "21:00"
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
        endTime: "01:00"
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
        endTime: "01:00"
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
    now.setDate(now.getDate() + 1);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "01:00"
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
        endTime: "01:00"
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
        endTime: "01:00"
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
        endTime: "01:00"
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
    // now.setDate(now.getDate() + 1);
    // MockDate.set(now);
    const inRange = isInPublishingRange(
      {
        startTime: "09:00",
        endTime: "01:00"
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
        endTime: "01:00"
      },
      now
    );
    expect(inRange).toBeTruthy();
  });
});

// describe("Publish range 00:00 - 09:00", () => {
//   afterEach(() => {
//     MockDate.reset();
//   });
//   it("should publish on 10:21", () => {
//     const now = new Date();
//     now.setHours(10);
//     now.setMinutes(21);
// MockDate.set(now);
//     const inRange = isInPublishingRange({
//       startTime: "09:00",
//       endTime: "01:00"
//     });
//     expect(inRange).toBeTruthy();
//   });
//   it("should publish on 09:00", () => {
//     const now = new Date();
//     now.setHours(9);
//     now.setMinutes(0);
//     MockDate.set(now);
//     const inRange = isInPublishingRange({
//       startTime: "09:00",
//       endTime: "01:00"
//     });
//     expect(inRange).toBeTruthy();
//   });
//   it("should publish on 01:00", () => {
//     const now = new Date();
//     now.setHours(1);
//     now.setMinutes(0);
//     MockDate.set(now);
//     const inRange = isInPublishingRange({
//       startTime: "09:00",
//       endTime: "01:00"
//     });
//     expect(inRange).toBeTruthy();
//   });
//   it("should not publish on 07:21", () => {
//     const now = new Date();
//     now.setHours(7);
//     now.setMinutes(21);
//     MockDate.set(now);
//     const inRange = isInPublishingRange({
//       startTime: "09:00",
//       endTime: "01:00"
//     });
//     expect(inRange).toBeFalsy();
//   });
//   it("should not publish on 08:59", () => {
//     const now = new Date();
//     now.setHours(8);
//     now.setMinutes(59);
//     MockDate.set(now);
//     const inRange = isInPublishingRange({
//       startTime: "09:00",
//       endTime: "01:00"
//     });
//     expect(inRange).toBeFalsy();
//   });
//   it("should not publish on 01:01", () => {
//     const now = new Date();
//     now.setHours(1);
//     now.setMinutes(1);
//     MockDate.set(now);
//     const inRange = isInPublishingRange({
//       startTime: "09:00",
//       endTime: "01:00"
//     });
//     expect(inRange).toBeFalsy();
//   });
// });
// describe("Publish range 00:00 - 00:00 (next-day)", () => {
//   afterEach(() => {
//     MockDate.reset();
//   });
//   it("should publish on 10:21", () => {
//     const now = new Date();
//     now.setHours(10);
//     now.setMinutes(21);
//     MockDate.set(now);
//     const inRange = isInPublishingRange({
//       startTime: "09:00",
//       endTime: "01:00"
//     });
//     expect(inRange).toBeTruthy();
//   });
//   it("should publish on 09:00", () => {
//     const now = new Date();
//     now.setHours(9);
//     now.setMinutes(0);
//     MockDate.set(now);
//     const inRange = isInPublishingRange({
//       startTime: "09:00",
//       endTime: "01:00"
//     });
//     expect(inRange).toBeTruthy();
//   });
//   it("should publish on 01:00", () => {
//     const now = new Date();
//     now.setHours(1);
//     now.setMinutes(0);
//     MockDate.set(now);
//     const inRange = isInPublishingRange({
//       startTime: "09:00",
//       endTime: "01:00"
//     });
//     expect(inRange).toBeTruthy();
//   });
//   it("should not publish on 07:21", () => {
//     const now = new Date();
//     now.setHours(7);
//     now.setMinutes(21);
//     MockDate.set(now);
//     const inRange = isInPublishingRange({
//       startTime: "09:00",
//       endTime: "01:00"
//     });
//     expect(inRange).toBeFalsy();
//   });
//   it("should not publish on 08:59", () => {
//     const now = new Date();
//     now.setHours(8);
//     now.setMinutes(59);
//     MockDate.set(now);
//     const inRange = isInPublishingRange({
//       startTime: "09:00",
//       endTime: "01:00"
//     });
//     expect(inRange).toBeFalsy();
//   });
//   it("should not publish on 01:01", () => {
//     const now = new Date();
//     now.setHours(1);
//     now.setMinutes(1);
//     MockDate.set(now);
//     const inRange = isInPublishingRange({
//       startTime: "09:00",
//       endTime: "01:00"
//     });
//     expect(inRange).toBeFalsy();
//   });
// });
// });
// describe("Publish range", () => {
//   test("should publish on 21:10 if ends in 22:30", () => {
//     const end = "22:30";
//     const date = "21:10";
//     const now = new Date();
//     const [hour, minutes] = date.split(":");
//     now.setHours(parseInt(hour));
//     now.setMinutes(parseInt(minutes));
//     const inRange = isInPublishingRange(end);
//     expect(inRange).toBeTruthy();
//   });
//   test("should NOT publish on 22:55 if, now ends in 22:30", () => {
//     const end = "22:30";
//     const date = "22:55";
//     const now = new Date();
//     const [hour, minutes] = date.split(":");
//     now.setHours(parseInt(hour));
//     now.setMinutes(parseInt(minutes));
//     const inRange = isInPublishingRange(end);
//     expect(inRange).toBeFalsy();
//   });
//   test("should NOT publish on 00:00 if, now ends in 23:59", () => {
//     const end = "23:59";
//     const date = "00:00";
//     const now = new Date();
//     const [hour, minutes] = date.split(":");
//     now.setHours(parseInt(hour));
//     now.setMinutes(parseInt(minutes));
//     const inRange = isInPublishingRange(end);
//     expect(inRange).toBeFalsy();
//   });
//   test("should publish on 23:55 if end, nows in 23:59", () => {
//     const end = "23:59";
//     const date = "23:55";
//     const now = new Date();
//     const [hour, minutes] = date.split(":");
//     now.setHours(parseInt(hour));
//     now.setMinutes(parseInt(minutes));
//     const inRange = isInPublishingRange(end);
//     expect(inRange).toBeTruthy();
//   });
//   test("should NOT publish on 1:12 if , nowends in 23:59", () => {
//     const end = "23:59";
//     const date = "1:12";
//     const now = new Date();
//     const [hour, minutes] = date.split(":");
//     now.setHours(parseInt(hour));
//     now.setMinutes(parseInt(minutes));
//     const inRange = isInPublishingRange(end);
//     expect(inRange).toBeFalsy();
//   });
//   test("should publish on 1:00 if ends, now in 2:10", () => {
//     const end = "2:10";
//     const date = "1:00";
//     const now = new Date();
//     const [hour, minutes] = date.split(":");
//     now.setHours(parseInt(hour));
//     now.setMinutes(parseInt(minutes));
//     const inRange = isInPublishingRange(end);
//     expect(inRange).toBeTruthy();
//   });
//   test("should NOT publish on 2:35 if , nowends in 2:10", () => {
//     const end = "2:10";
//     const date = "2:35";
//     const now = new Date();
//     const [hour, minutes] = date.split(":");
//     now.setHours(parseInt(hour));
//     now.setMinutes(parseInt(minutes));
//     const inRange = isInPublishingRange(end);
//     expect(inRange).toBeFalsy();
//   });
//   test("should publish on 22:15 if end, nows in 2:10", () => {
//     const end = "2:10";
//     const date = "22:15";
//     const now = new Date();
//     const [hour, minutes] = date.split(":");
//     now.setHours(parseInt(hour));
//     now.setMinutes(parseInt(minutes));
//     const inRange = isInPublishingRange(end);
//     expect(inRange).toBeTruthy();
//   });
//   test("should publish on 22:00 if end, nows in 2:10", () => {
//     const end = "2:10";
//     const date = "22:00";
//     const now = new Date();
//     const [hour, minutes] = date.split(":");
//     now.setHours(parseInt(hour));
//     now.setMinutes(parseInt(minutes));
//     const inRange = isInPublishingRange(end);
//     expect(inRange).toBeTruthy();
//   });
// }, now);
