const axios = require("axios");

const { runtime_2_min } = require("../../utils/utils.js");

module.exports.getRapidData = async (query) =>
  new Promise((resolve, reject) => {
    const options = {
      method: "GET",
      url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/${query}`,
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
        if (!titles) resolve([]);

        const titleRequests = titles.map((data) => {
          const url = `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${data.id}`;
          return axios.get(url, options);
        });

        return Promise.all(titleRequests).then((result) => {
          const output = result.map((res) => {
            const film = {
              title: res.data.title ? res.data.title.trim() : "",
              year: res.data.year,
              imdb_id: res.data.id,
              length: runtime_2_min(res.data.length),
              rating_votes: res.data.rating_votes,
              cast:
                res.data.cast === undefined
                  ? []
                  : res.data.cast.map((actor) => actor.actor),
            };

            let factor = 0.596;
            if (
              film.title
                .replaceAll(" ", "")
                .toLowerCase()
                .includes(query.replaceAll(" ", "").toLowerCase())
            )
              factor *= 1.2;
            if (film.year.length > 0) factor *= 1.1;
            if (film.length > 0) factor *= 1.1;
            if (film.rating_votes.length > 0) factor *= 1.1;
            if (film.cast.length > 0) factor *= 1.05;

            film.factor = factor;

            return film;
          });

          resolve(output);
        });
      })
      .catch(function (error) {
        console.error(error);
        resolve([]);
      });
  });
