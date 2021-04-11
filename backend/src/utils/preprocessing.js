//Spell checking and dictionaries
var en = require('dictionary-en')

const nspell = require('nspell')

const wtn = require('words-to-numbers')
const cnr = require('cr-numeral')

var variations = []
var WEIGHTS = {numberToWord : 0.95, wordToNumber : 0.95, numberToRoman : 0.5, spellCheck : 0.90, charRemoval : 0.95}

module.exports.createVariations = function createVariations(original_string) {
    variations = []
    collapseWhiteSpace(original_string)
    original_string.trim()
    let search_words = original_string.split(' ');
    
    //Original Search
    addVariation(search_words, 1.)

    //Variation generation
    cleanUp()
    //spellChecking()
    numberModifier()
    return variationsToString() 
}   

function addVariation(words,weight){
    let clean_words = []
    words.forEach( function(value){
        if( value !== ""){
            clean_words.push(value)
        }
    })
    variations.push({
        search_words: clean_words,
        weight: weight
    })
}

function variationsToString(){
    strVariations = []
    variations.forEach(function(value){
        let search_term = value.search_words.join(' ')
        console.log(search_term)
        strVariations.push({
            term: search_term,
            weight: value.weight  
        })

    })
    return strVariations
}

function numberModifier() {
    
    let variation_cache = []

    variations.forEach(function (value, weight){
       
        // digit -> word (10 -> ten)
        let new_variation = []
        let is_changed = false
        value.search_words.forEach( function (word) { 
            if(!isNaN(word)){
                var converter = require('number-to-words')
                console.log(word)
                new_variation.push(converter.toWords(word))
                is_changed = true;
            } else {
                new_variation.push(word)
            }
        })
        if( is_changed == true ){
            variation_cache.push({
                search_words: new_variation,
                weight: value.weight * WEIGHTS.numberToWord
            })
        } 

        // words both ordinal and basic to digit (ten/tenth -> 10) 
        new_variation = []
        is_changed = false
        value.search_words.forEach( function (word) {
            if (wtn.wordsToNumbers(word) !== word) {
                new_variation.push(wtn.wordsToNumbers(word).toString())
                is_changed = true   
            } else {
                new_variation.push(word)
            }         
        })
        if( is_changed == true ){
            variation_cache.push({
                search_words: new_variation,
                weight: value.weight * WEIGHTS.wordToNumber
            })
        } 

        // digits to roman (1 -> I)
        new_variation = []
        is_changed = false
        value.search_words.forEach( function (word) { 
            if(!isNaN(word)){
                const cnr = require("cr-numeral").convertNumberToRoman
                new_variation.push(cnr(parseInt(word)))
                is_changed = true
            }else {
                new_variation.push(word)
            }
        })
        if( is_changed == true ){
            variation_cache.push({
                search_words: new_variation,
                weight: value.weight * WEIGHTS.numberToRoman
            })
        } 
    })

    variation_cache.forEach(function(value){
        addVariation(value.search_words,value.weight)
    })
    
}

function spellChecking(){

    let spell = nspell(en.aff, [,en.dict])
    variations.forEach( function (value){
        let error_count = 0
        let new_variation = []
        value.search_words.forEach( function (word){ 
            if (!spell.correct(word)) {
                new_variation.push(spell.suggest(word))
                error_count++
            } else {
                new_variation.push(word)
            }
        })
        if (error_count !== 0){
            addVariation(new_variation, value.weight * Math.pow(WEIGHTS.spellCheck, error_count))
        }
    })
}

function cleanUp(){
    variations.forEach( function (value){

        let search_term = value.search_words.join(' ');
        let old_lenght = search_term.lenght
        search_term = search_term.replace(/[|\-&;:$%@"<>+,]/g, " ")
        search_term = search_term.replace(/ *\([^)]*\) */g, " ")
        collapseWhiteSpace(search_term)
        search_term.trim()
        let lenght_dif = old_lenght - search_term.lenght
        if (true) {
            let new_search_words = search_term.split(' ');
            addVariation(new_search_words, value.weight * Math.pow(WEIGHTS.charRemoval, lenght_dif))
        }
    })
}

function collapseWhiteSpace(value) {
    return String(value).replace(/\s+/g, ' ')
}