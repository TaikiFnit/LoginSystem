var mongoose = require('mongoose');
var url = 'mongodb://localhost/user';

var db = mongoose.createConnection(url, function(err, res){
  if(err){
    console.log('Error connected: ' + url + ' - ' + err);
  } else {
    console.log('Success connected: ' + url);
  }
});
