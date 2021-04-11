const router = require("express").Router();

const { getTMDBData } = require("./helper/tmdb.js");
const { getRapidData } = require("./helper/rapid.js");
const { getIMDBData } = require("./helper/imdb.js");

router.get("/", async (req, res) => {
  const { q } = req.query;

  const APIcalls = [getTMDBData(q), getRapidData(q), getIMDBData(q)];

  Promise.all(APIcalls).then((data) => {
    data = data.flat();
    let data_dic = {};
    let imdb_ids = [];

    data.forEach((elem) => {
      let id = elem.imdb_id;
      if (!id) return;

      if (data_dic[id] === undefined) {
        imdb_ids.push(id);
        data_dic[id] = [];
      }

      data_dic[id].push(elem);
    });

    imdb_ids.forEach((id) => {
      let results = data_dic[id];
      let movie = {
        id,
        factor: 0,
      };

      results.forEach((result) => {
        if (!movie.title || result.language === "en")
          movie.title = result.title;
        if (result.year.length > 0) movie.year = result.year;
        if (result.length > 0) movie.length = result.length;
        movie.factor += result.factor;
      });

      movie.factor /= results.length;
      movie.factor = Math.min(
        1.0,
        1 - (1 - movie.factor) * (1 / results.length)
      );

      data_dic[id] = movie;
    });

    res.json(data_dic);
  });
});

module.exports = router;
