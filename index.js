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

var savedQuestions = [];
var uvid = '';
var tutorHelping = 0;

getQueue();

rl.on('line', cmd => { 
    var index = parseInt(cmd) - 1;
    if ( tutorHelping ) {
        http.get(`http://tutorhelp.uvu.edu/api_data.php?action=finishquestion&questionId=${tutorHelping}`, (res) => {
            res.setEncoding('utf8');
            tutorHelping = 0;
            getQueue();
            });
    } else {
        if ( index < savedQuestions.length ) {
            console.log('\033c');
            http.get(`http://tutorhelp.uvu.edu/api_data.php?action=respondquestion&questionId=${savedQuestions[index].id}&tutorUvid=${uvid}`, (res) => {
                res.setEncoding('utf8');
                res.on('data', (chunk) => { console.log(`Helping ${savedQuestions[index].studentName}`) }); 
                tutorHelping = savedQuestions[index].id;
                });
        }
    }
});

function getQueue() {
    if ( tutorHelping ) { return; }
    // set id equal to your student id
    http.get('http://tutorhelp.uvu.edu/api_data.php?action=getquestions&tutorid=' + uvid + '&center=4', (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                var data = JSON.parse(chunk);
                // TODO: change these condidtions to a more simple and lightweight one
                if ( !data.questions.length ) { printQuestions(data.questions); }
                if ( _.differenceWith(data.questions, savedQuestions, _.isEqual ).length > 0) {
                    process.stdout.write('\x07');
                    printQuestions(data.questions);
                } else if ( _.differenceWith(savedQuestions, data.questions, _.isEqual ).length > 0) {
                    printQuestions(data.questions);
                }
            });
            }).on('error', (e) => { 
		    console.log(`Got error: ${e.message}`); 
		    console.log('\x07');
	    });
}


function printQuestions(questions) {
    console.log('\033c');
    savedQuestions = _.cloneDeep(questions);
    console.log("Name\t\t\t\tClass\t\t\tTable\t\t\tQuestion");
    console.log("-----------------------------------------------------------------");
    _.forEach(questions, o => {
        console.log(`${o.studentName}\t\t\t${o.class}\t\t${o.table}\t\t\t${o.question}`);
    });
}

fs.readFile('uvid.txt', (err, data) => {
    if (err) throw err;
    uvid = data.toString();
});

setInterval(getQueue, 5000);
