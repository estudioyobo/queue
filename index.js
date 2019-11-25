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
  stopQueue(req.query.id);
  res.send({ ok: true });
});

app.get("/start", (req, res) => {
  const id = startQueue(
    {
      startTime: "09:00",
      endTime: "23:00",
      interval: 1
    },
    () => console.log("iterando")
  );
  res.send(id);
});

app.listen(PORT, () => {
  console.log("Http server running and listening on port", PORT);
});
