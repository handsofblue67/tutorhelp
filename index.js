var http = require('http');
var _ = require('lodash');

var savedQuestions = [];

setInterval(function() {
  // set id equal to your student id
  http.get('http://tutorhelp.uvu.edu/api_data.php?action=getquestions&tutorid=', (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      var data = JSON.parse(chunk);
      console.log(data.questions);
      if (_.differenceWith(data.questions, savedQuestions, _.isEqual).length > 0) {
        console.log(_.differenceWith(data.questions, savedQuestions, _.isEqual));
        process.stdout.write('\x07');
        savedQuestions = _.cloneDeep(data.questions);
        console.log('saved');
        console.log(savedQuestions);
      }
    });
    res.on('end', () => {
      console.log('No more data in response.')
    })
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
}, 5000);
