const router = require("express").Router();
const axios = require("axios");

const { runtime_2_min } = require("../../utils/utils.js");

router.get("/", async (req, res) => {
  const { q } = req.query;

  const options = {
    method: "GET",
    url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/${q}`,
    headers: {
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "68e61c7769msh65355189be47a6bp10342djsn6a6ee3266cfd",
      "X-RapidAPI-Host":
        "imdb-internet-movie-database-unofficial.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      const titles = response.data.titles;
      const titleRequests = titles.map((data) => {
        const url = `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${data.id}`;
        return axios.get(url, options);
      })

      Promise.all(titleRequests)
        .then((result) => {
          const output = result.map((res) => {
            const film = {
              title: res.data.title,
              year: res.data.year,
              imbd_id: res.data.id,
              length: runtime_2_min(res.data.length),
              rating_votes: res.data.rating_votes,
              cast: res.data.cast === undefined ? [] : res.data.cast.map((actor) => actor.actor)
            }

            return film;
          });

          console.log(output);
          res.json(output);
        })
    })
    .catch(function (error) {
      console.error(error);
    });
});

router.get("/film", async (req, res) => {
  const { id } = req.query;

  const options = {
    method: "GET",
    url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${id}`,
    headers: {
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "68e61c7769msh65355189be47a6bp10342djsn6a6ee3266cfd",
      "X-RapidAPI-Host":
        "imdb-internet-movie-database-unofficial.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
});

module.exports = router;
