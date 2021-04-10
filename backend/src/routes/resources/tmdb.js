const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");

const moviedb = new MovieDb("8dda66a612926665b37d33db21eca331");

router.get("/", async (req, res) => {
  const { q } = req.query;

  moviedb
    .searchMovie({ query: q })
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch(console.error);
});

module.exports = router;
