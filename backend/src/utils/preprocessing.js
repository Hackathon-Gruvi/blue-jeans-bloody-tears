import {collapseWhiteSpace} from 'collapse-white-space'

var variations = []

function createVariations(original_string) {
    
    collapseWhiteSpace(original_string)
    original_string.trim()
    let search_words = original_string.split(' ');
    
    addVariation(search_words, 1.)   
    

    return variations
}   

function addVariation(word_array, match){
    var variation = word_array.join(' ')
    variations.push({
        key: variation,
        value: match
    })
}