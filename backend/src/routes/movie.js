const router = require("express").Router();

const { getTMDBData } = require("./helper/tmdb.js");
const { getRapidData } = require("./helper/rapid.js");
const { getIMDBData } = require("./helper/imdb.js");

router.get("/", async (req, res) => {
  const { q } = req.query;

  const APIcalls = [getTMDBData(q), getRapidData(q), getIMDBData(q)];

  Promise.all(APIcalls).then((data) => {
    res.json(data.flat());
  });
});

module.exports = router;
