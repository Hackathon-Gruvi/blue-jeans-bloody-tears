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

        let output = {
          imdb_id: result,
          title: data.title ? data.title.trim() : "",
          year: data.year,
          length: runtime_2_min(data.runtime),
          genres: data.genre,
          director: data.director !== "N/A" ? data.director : undefined,
          writer: data.writer !== "N/A" ? data.writer : undefined,
        };

        let factor = 0.596;
        if (
          output.title
            .replaceAll(" ", "")
            .toLowerCase()
            .includes(query.replaceAll(" ", "").toLowerCase())
        )
          factor *= 1.2;
        if (output.year.length > 0) factor *= 1.1;
        if (output.length > 0) factor *= 1.1;
        if (output.genres.length > 0) factor *= 1.1;
        if (output.writer !== undefined || output.director !== undefined)
          factor *= 1.05;

        output.factor = factor;

        resolve([output]);
      });
    });
  });
