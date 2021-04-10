const router = require("express").Router();
var nameToImdb = require("name-to-imdb");
var imdb = require("imdb");

const { runtime_2_min } = require("../../utils/utils.js");

router.get("/", async (req, res) => {
  const { q } = req.query;

  nameToImdb(q, async function (err, result, information) {
    if (err || result === undefined) {
      res.status(404).send(err);
    }

    imdb(result, async function (err, data) {
      if (err) {
        console.log(err.stack);
        return res.status(500).send(err);
      }

      if (!data) {
        return res.status(404).send();
      }

      res.json({
        imdb_id: result,
        title: data.title,
        date: data.year,
        length: runtime_2_min(data.runtime),
        genres: data.genre,
        director: data.director !== "N/A" ? data.director : undefined,
        writer: data.writer !== "N/A" ? data.writer : undefined,
      });
    });
  });
});

module.exports = router;
