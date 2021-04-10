const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const apiRouter = require("./routes/api.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send();
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
