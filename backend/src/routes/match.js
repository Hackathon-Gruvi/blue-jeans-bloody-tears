const router = require("express").Router();

const { getTMDBData } = require("./helper/tmdb.js");
const { getRapidData } = require("./helper/rapid.js");
const { getIMDBData } = require("./helper/imdb.js");
const preprocessing = require("../utils/preprocessing");

const aggregateResults = (data, f) => {
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

  let output = [];

  imdb_ids.forEach((id) => {
    let results = data_dic[id];
    let movie = {
      imdb_id: id,
      factor: 0,
    };

    results.forEach((result) => {
      if (!movie.title || result.language === "en") movie.title = result.title;
      if (result.year) movie.year = result.year;
      movie.factor += result.factor;
    });

    movie.factor /= results.length;
    movie.factor = (1 - (1 - movie.factor) * (1 / results.length)) * f;

    output.push(movie);
  });

  return output;
};

const queryDatabases = (q, f, i) =>
  new Promise((resolve, reject) => {
    const api_calls = [getRapidData(q), getIMDBData(q)];

    if (i < 3) api_calls.push(getTMDBData(q));

    Promise.all(api_calls)
      .then((data) => {
        const output = aggregateResults(data, f);

        resolve(output);
      })
      .catch((err) => {
        console.log(err);
        resolve([]);
      });
  });

router.get("/", async (req, res) => {
  const query = req.query.q;

  if (!query) res.status(400).end();

  queries = preprocessing.createVariations(query);

  let query_calls = queries.map(({ q, f }, index) => {
    if (q && f) return queryDatabases(q, f, index);
  });

  Promise.all(query_calls)
    .then((data) => {
      const output = aggregateResults(data, 1.0);

      output.sort((a, b) => b.factor - a.factor);

      console.log(output.length);

      res.json(output);
    })
    .catch((err) => {
      res.status(500).end(`Error occured: ${err}`);
    });
});

module.exports = router;
