var http = require('http');
var _ = require('lodash');

var savedQuestions = [];

setInterval(function() {
    // set id equal to your student id
    http.get('http://tutorhelp.uvu.edu/api_data.php?action=getquestions&tutorid=', (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            var data = JSON.parse(chunk);
            if (_.differenceWith(data.questions, savedQuestions, _.isEqual).length > 0) {
                console.log('\033c');
                process.stdout.write('\x07');
                savedQuestions = _.cloneDeep(data.questions);
                console.log("Name\t\t\tClass\t\tTable\t\tQuestion");
                console.log("-----------------------------------------------------------------");
                savedQuestions.forEach(o => {
                    console.log(`${o.studentName}\t\t${o.class}\t${o.table}\t\t${o.question}`);
                });
            } else if (_.differenceWith(savedQuestions, data.questions, _.isEqual).length > 0) {
                console.log('\033c');
                savedQuestions = _.cloneDeep(data.questions);
                console.log("Name\t\t\tClass\t\tTable\t\tQuestion");
                console.log("-----------------------------------------------------------------");
                savedQuestions.forEach(o => {
                    console.log(`${o.studentName}\t\t${o.class}\t${o.table}\t\t${o.question}`);
                });
            }
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });
}, 5000);
