const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");

const moviedb = new MovieDb("8dda66a612926665b37d33db21eca331");

const getMovieDetails = async (id) => {
  return await moviedb
    .movieInfo(id)
    .then((res) => {
      let genres = [];
      let companies = [];

      if (res.genres !== undefined) {
        res.genres.forEach((genre) => {
          genres.push(genre.name);
        });
      }

      if (res.production_companies !== undefined) {
        res.production_companies.forEach((company) => {
          companies.push(company.name);
        });
      }

      return {
        imdb_id: res.imdb_id,
        lenght: res.runtime,
        genres,
        companies,
      };
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

router.get("/", async (req, res) => {
  const { q } = req.query;

  moviedb
    .searchMovie({ query: q })
    .then(async (result) => {
      let matches = [];

      if (result.results.length === 0) res.json([]);

      for (let i = 0; i < result.results.length; i++) {
        let movie = result.results[i];
        let info = await getMovieDetails(movie.id);

        let date;
        if (movie.release_date !== undefined)
          date = movie.release_date.length > 0 ? movie.release_date : undefined;

        let output = {
          title: movie.title,
          original_title: movie.original_title,
          date,
          language: movie.original_language,
        };

        if (info !== undefined && info !== null) {
          output.imdb_id = info.imdb_id;
          output.length = info.length;
          output.genres = info.genres;
          output.companies = info.companies;
        }

        matches.push(output);
      }

      res.json(matches);
    })
    .catch((error) => {
      res.status(500).end(error);
    });
});

module.exports = router;
