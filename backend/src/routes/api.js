const router = require("express").Router();

const tmdbRouter = require("./resources/tmdb.js");
const rapidRouter = require("./resources/rapid.js");
const imdbRouter = require("./resources/imdb.js");
const movieRouter = require("./movie.js");

router.use("/tmdb", tmdbRouter);
router.use("/rapid", rapidRouter);
router.use("/imdb", imdbRouter);
router.use("/movie", movieRouter);

module.exports = router;
