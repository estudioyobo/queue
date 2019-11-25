const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { startQueue, stopQueue } = require("./queue.js");

// your express configuration here
const app = express();
// Options
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// CORS
app.use(cors());

app.get("/stop", (req, res) => {
  stopQueue();
  res.send({ ok: true });
});

app.listen(PORT, () => {
  console.log("Http server running and listening on port", PORT);
  startQueue(
    {
      startTime: "09:00",
      endTime: "23:00",
      interval: 1
    },
    () => console.log("iterando")
  );
});
