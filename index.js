const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { startQueue } = require("./queue.js");

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

app.listen(PORT, () => {
  console.log("Http server running and listening on port", PORT);
  startQueue();
});
