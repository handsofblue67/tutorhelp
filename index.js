var http = require('http');
var _ = require('lodash');

var savedQuestions = [];

function printQuestions(questions) {
    console.log('\033c');
    savedQuestions = _.cloneDeep(questions);
    console.log("Name\t\t\t\tClass\t\t\tTable\t\t\tQuestion");
    console.log("-----------------------------------------------------------------");
    savedQuestions.forEach(o => {
        console.log(`${o.studentName}\t\t\t${o.class}\t\t${o.table}\t\t\t${o.question}`);
    });
}

setInterval(function() {
    // set id equal to your student id
    http.get('http://tutorhelp.uvu.edu/api_data.php?action=getquestions&tutorid=10704736', (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            var data = JSON.parse(chunk);
            // TODO: change these condidtions to a more simple and lightweight one
            if (_.differenceWith(data.questions, savedQuestions, _.isEqual).length > 0) {
                process.stdout.write('\x07');
                printQuestions(data.questions);
            } else if (_.differenceWith(savedQuestions, data.questions, _.isEqual).length > 0) {
                printQuestions(data.Questions);
            }
        });
    }).on('error', (e) => { console.log(`Got error: ${e.message}`); });
}, 5000);
