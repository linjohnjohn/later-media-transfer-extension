/**
 * if the text uses only simple words (where a word is a continuous sequence of
 * alphabetical characters or apostrophe), console logs 'Text is simple!' otherwise,
 * console logs 'You used some less simple words: ' and the set of less simple words
 * used as alphabetically sorted comma separated values and in lowercase
 *
 * @param {String} text string to be tested if written simply
 */
function simpleWriter(text) {
    // expect simpleWords to be a string, in the global scope, representing the list of
    // simple words with a pipe character between each allowed simple word
    const wordMap = simpleWords.split('|')
        .map(word => word.toLowerCase())
        .reduce((wordMap, word) => {
            wordMap[word] = true;
            return wordMap;
        }, {});

    // map of unsimple word violation to frequency of the violation
    const complexWordViolations = text.toLowerCase().split(/[^a-z']/)
        .reduce((violations, candidateWord) => {
            if (candidateWord !== '' && !(candidateWord in wordMap)) {
                candidateWord in violations ? violations[candidateWord] += 1 : violations[candidateWord] = 1;
            }
            return violations;
        }, {});

    if (Object.keys(complexWordViolations).length === 0) {
        console.log('Text is simple!');
    } else {
        console.log(`You used some less simple words: ${Object.keys(complexWordViolations).sort().join(', ')}`);
    }
}

function simpleWriterTests() {
    // expect 'You used some less simple words: reasonable'
    simpleWriter('reasonable');

    // expect 'You used some less simple words: processor, reasonable'
    simpleWriter('reasonable reasonable processor  processor');

    // expect 'You used some less simple words: guam, island, pineapple, pineapples'
    simpleWriter('The largest pineapple was found in the island of Guam, and the smallest pineapple was also found on the island of Guam. I really like pineapples!');

    // expect 'You used some less simple words: shouldn't'
    simpleWriter(`shouldn't`);

    // expect 'Text is simple!'
    simpleWriter('');

    // expect 'Text is simple!'
    simpleWriter(`I'm asleep`);

    // expect 'Text is simple!'
    simpleWriter('I am 17');

    // expect 'Text is simple!'
    simpleWriter('glancing chooser happened');
}