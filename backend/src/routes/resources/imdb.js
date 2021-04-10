const router = require("express").Router();
var nameToImdb = require("name-to-imdb");
var imdb = require("imdb");

router.get("/name", async (req, res) => {
  const { q } = req.query;

  nameToImdb(q, function (err, result, information) {
    console.log(result);
    console.log(information);

    res.json({
      id: result,
      info: information,
    });
  });
});

router.get("/info", async (req, res) => {
  const { id } = req.query;

  imdb(id, function (err, data) {
    if (err) {
      console.log(err.stack);
      res.status(500).send(err.stack);
    }

    if (data) {
      console.log(data);
      res.json(data);
    }
  });
});

module.exports = router;
