# Queue

Package to call periodic callbacks within an interval given a time range.

## API

- **start(options): _String_**

  Receives an object with the options `{startTime: String, endTime: String, interval: Number, action: function, onStart: function, onStop: function}`, and the function to be called.

  Example:

  ```js
  start({ 
    startTime: "09:00", 
    endTime: "23:30", 
    interval: 15, 
    action: () => console.log("Hello World!")
  });
  ```

  With this configuration, a queue is created, which prints `Hello world` every 15 minutes between 09:00-23:30 every day.

  Returns the queue id.

- **stop(id): _Void_**

  Stops the queue with the given id.

- **updateOptions(id, options): _Void_**

  Updates the options of the specified queue. Expects an object with at least one of the options used in `start`
