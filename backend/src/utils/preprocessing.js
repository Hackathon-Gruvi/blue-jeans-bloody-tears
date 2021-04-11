//Spell checking and dictionaries
var dictionary = require("dictionary-en");

const nspell = require("nspell");
const sw = require("stopword");
const wtn = require("words-to-numbers");
const cnr = require("cr-numeral");
const { getWordsList } = require("most-common-words-by-language");

const VAR_LIMIT = 10;
const WEIGHTS = {
  andMod: 0.95,
  numberToWord: 0.95,
  wordToNumber: 0.95,
  numberToRoman: 0.5,
  spellCheck: 0.9,
  charRemoval: 0.95,
  stopWords: 0.8,
};

module.exports.createVariations = function createVariations(original_string) {
  let variations = [];
  collapseWhiteSpace(original_string);
  original_string.trim();
  let search_words = original_string.split(" ");

  //Original Search
  addVariation(variations, search_words, 1);

  //Variation generation
  commonWordRemover(variations);
  andSwitch(variations);
  cleanUp(variations);
  //await spellChecking()
  numberModifier(variations);
  return jsonOutput(variations);
};

function addVariation(variations, words, weight) {
  let clean_words = [];
  words.forEach(function (value) {
    if (value !== "") {
      clean_words.push(value);
    }
  });

  if (clean_words.length === 0) return;

  variations.push({
    search_words: clean_words,
    weight: weight,
  });
}

function numberModifier(variations) {
  let variation_cache = [];

  variations.forEach(function (value) {
    // digit -> word (10 -> ten)
    let new_variation = [];
    let is_changed = false;
    value.search_words.forEach(function (word) {
      if (!isNaN(word)) {
        var converter = require("number-to-words");

        new_variation.push(converter.toWords(word));
        is_changed = true;
      } else {
        new_variation.push(word);
      }
    });
    if (is_changed == true) {
      variation_cache.push({
        search_words: new_variation,
        weight: value.weight * WEIGHTS.numberToWord,
      });
    }

    // words both ordinal and basic to digit (ten/tenth -> 10)
    new_variation = [];
    is_changed = false;
    value.search_words.forEach(function (word) {
      if (wtn.wordsToNumbers(word) !== word) {
        new_variation.push(wtn.wordsToNumbers(word).toString());
        is_changed = true;
      } else {
        new_variation.push(word);
      }
    });
    if (is_changed == true) {
      variation_cache.push({
        search_words: new_variation,
        weight: value.weight * WEIGHTS.wordToNumber,
      });
    }

    // digits to roman (1 -> I)
    new_variation = [];
    is_changed = false;
    value.search_words.forEach(function (word) {
      if (!isNaN(word)) {
        const cnr = require("cr-numeral").convertNumberToRoman;
        new_variation.push(cnr(parseInt(word)));
        is_changed = true;
      } else {
        new_variation.push(word);
      }
    });
    if (is_changed == true) {
      variation_cache.push({
        search_words: new_variation,
        weight: value.weight * WEIGHTS.numberToRoman,
      });
    }
  });

  variation_cache.forEach(function (value) {
    addVariation(variations, value.search_words, value.weight);
  });
}

const spellChecking = () =>
  new Promise((resolve, reject) => {
    console.log(dictionary);
    dictionary(function (err, result) {
      let spell = nspell(result);
      variations.forEach(function (value) {
        let error_count = 0;
        let new_variation = [];
        value.search_words.forEach(function (word) {
          if (!spell.correct(word)) {
            new_variation.push(spell.suggest(word));
            error_count++;
          } else {
            new_variation.push(word);
          }
        });
        if (error_count !== 0) {
          addVariation(
            variations,
            new_variation,
            value.weight * Math.pow(WEIGHTS.spellCheck, error_count)
          );
        }
      });
      resolve();
    });
  });

// function spellChecking() {
//     console.log(dictionary)
//     dictionary(function (err, result) {
//         let spell = nspell(result)
//         variations.forEach(function (value) {
//             let error_count = 0
//             let new_variation = []
//             value.search_words.forEach(function (word) {
//                 if (!spell.correct(word)) {
//                     new_variation.push(spell.suggest(word))
//                     error_count++
//                 } else {
//                     new_variation.push(word)
//                 }
//             })
//             if (error_count !== 0) {
//                 addVariation(variations, new_variation, value.weight * Math.pow(WEIGHTS.spellCheck, error_count))
//             }
//         })
//     })
// }

function cleanUp(variations) {
  let variation_cache = [];

  variations.forEach(function (value) {
    let search_term = value.search_words.join(" ");
    let old_string = search_term;
    let old_length = search_term.length;
    search_term = search_term.replace(/ *\([^)]*\) */g, " ");
    search_term = search_term.replace(/[^A-Za-z0-9]/g, " ");
    collapseWhiteSpace(search_term);
    search_term.trim();
    let length_dif = old_length - search_term.length;
    if (search_term !== old_string) {
      let new_search_words = search_term.split(" ");
      variation_cache.push({
        search_words: new_search_words,
        weight: value.weight * Math.pow(WEIGHTS.charRemoval, length_dif + 1),
      });
    }
  });

  variation_cache.forEach(function (value) {
    addVariation(variations, value.search_words, value.weight);
  });
}

function collapseWhiteSpace(value) {
  return String(value).replace(/\s+/g, " ");
}

function andSwitch(variations) {
  let new_variation = [];
  let variation_cache = [];

  variations.forEach(function (value) {
    let search_and = value.search_words.join(" ");
    let old_string = search_and;
    search_and = search_and.replace(/(and )/gi, "& ");

    if (search_and !== old_string) {
      collapseWhiteSpace(search_and);
      search_and.trim();
      let new_search_words = search_and.split(" ");
      variation_cache.push({
        search_words: new_search_words,
        weight: WEIGHTS.andMod * value.weight,
      });
    }

    search_and = value.search_words.join(" ");
    old_string = search_and;
    search_and = search_and.replace(/(&)/g, " and ");
    collapseWhiteSpace(search_and);
    search_and.trim();

    if (search_and !== old_string) {
      let new_search_words = search_and.split(" ");
      variation_cache.push({
        search_words: new_search_words,
        weight: WEIGHTS.andMod * value.weight,
      });
    }
  });

  variation_cache.forEach(function (value) {
    addVariation(variations, value.search_words, value.weight);
  });
}

function commonWordRemover(variations) {
  let variation_cache = [];
  variations.forEach(function (value) {
    let newString = sw.removeStopwords(value.search_words);
    let weight = value.weight * WEIGHTS.stopWords;
    if (newString.length !== 0) {
      variation_cache.push({
        search_words: newString,
        weight: weight,
      });
    }
  });
  variation_cache.forEach(function (value) {
    addVariation(variations, value.search_words, value.weight);
  });
}

function jsonOutput(variations) {
  var queries = [];

  variations.forEach(function (value) {
    queries.push({
      q: value.search_words.join(" "),
      f: value.weight,
    });
  });

  queries.sort((a, b) => b.f - a.f);

  queries = queries.slice(0, VAR_LIMIT);

  // console.log({queries})

  return queries;
}
