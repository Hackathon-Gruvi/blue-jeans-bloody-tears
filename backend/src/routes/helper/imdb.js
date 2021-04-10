var nameToImdb = require("name-to-imdb");
var imdb = require("imdb");

const { runtime_2_min } = require("../../utils/utils.js");

module.exports.getIMDBData = async (query) =>
  new Promise((resolve, reject) => {
    nameToImdb(query, async function (err, result, information) {
      if (err || result === undefined) {
        resolve([]);
      }

      imdb(result, async function (err, data) {
        if (err) {
          console.log(err.stack);
          resolve([]);
        }

        if (!data) {
          resolve([]);
        }

        resolve([
          {
            imdb_id: result,
            title: data.title,
            date: data.year,
            length: runtime_2_min(data.runtime),
            genres: data.genre,
            director: data.director !== "N/A" ? data.director : undefined,
            writer: data.writer !== "N/A" ? data.writer : undefined,
          },
        ]);
      });
    });
  });
