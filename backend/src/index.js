const express = require("express");

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const apiRouter = require("./routes/api.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).end();
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
