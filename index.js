// respond to qustion
// http://tutorhelp.uvu.edu/api_data.php?action=respondquestion&questionId=18321&tutorUvid=10704736
// finish
// http://tutorhelp.uvu.edu/api_data.php?action=finishquestion&questionId=18321

var _ = require('lodash');
var fs = require('fs');
var http = require('http');
const readline = require('readline');


// TODO: use enpoints and this readline interface to respond and finish answering questions.
const rl = readline.createInterface({
    input: process.stdin,
      output: process.stout
});

var uvid = '';
var savedQuestions = [];
function printQuestions(questions) {
    console.log('\033c'); // clear console
    savedQuestions = _.cloneDeep(questions);
    console.log("Name\t\t\t\tClass\t\t\tTable\t\t\tQuestion");
    console.log("------------------------------------------------------------------------------------------");
    _.forEach(savedQuestions, o => {
        console.log(`${o.studentName}\t\t\t${o.class}\t\t${o.table}\t\t\t${o.question}`);
    });
}

fs.readFile('uvid.txt', (err, data) => {
    if (err) throw err;
    uvid = data.toString();
});

setInterval(function() {
    // set id equal to your student id
    http.get('http://tutorhelp.uvu.edu/api_data.php?action=getquestions&tutorid=' + uvid, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                var questions = JSON.parse(chunk).questions;
                if (_.differenceWith(questions, savedQuestions, _.isEqual).length > 0) {
                    process.stdout.write('\x07'); // bell
                    printQuestions(questions);
                } else if (_.differenceWith(savedQuestions, questions, _.isEqual).length > 0) {
                    printQuestions(questions);
                }
            });
            }).on('error', (e) => { console.log(`Got error: ${e.message}`); });
}, 10000);
