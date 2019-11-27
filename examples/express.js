const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Queue = require("../index");

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
  Queue.stop(req.query.id);
  res.send({ ok: true });
});

app.get("/update", (req, res) => {
  Queue.updateOptions(req.query.id, { interval: req.query.interval });
  res.send({ ok: true });
});

app.get("/start", (req, res) => {
  const id = Queue.start({
    startTime: "09:00",
    endTime: "23:00",
    interval: 1,
    action: ({ id }) => console.log(`iterando la cola ${id}`)
  });
  res.send(id);
});

app.listen(PORT, () => {
  console.log("Http server running and listening on port", PORT);
});
