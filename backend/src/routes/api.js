const router = require("express").Router();

const tmdbRouter = require("./resources/tmdb.js");
const rapidRouter = require("./resources/rapid.js");
const imdbRouter = require("./resources/imdb.js");

router.use("/tmdb", tmdbRouter);
router.use("/rapid", rapidRouter);
router.use("/imdb", imdbRouter);

module.exports = router;
