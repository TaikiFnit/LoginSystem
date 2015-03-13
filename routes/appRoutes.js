var express = require('express');
var router = express.Router();
// mongoDBの接続
var model = require('../model.js');
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: 'mod1_user',
  password: process.env.DB_PASS || 'IRC2015',
  database: process.env.DB_NAME || 'mod1_DB'
});

// Catch data from Database and output console
connection.query('select * from users', function(err, results, fields){
	// output results		
	console.log('Connection Test to MySQL from users');
	console.log('---results---');
	console.log(results);
	console.log('---result end---');
	//console.log('---fields---');
	//console.log(fields);
	//console.log('---fields end---');
});

// アカウント登録
router.post('/appCreate', function(req, res) {
	// output request data
	console.log(req.body);
    var name = req.body.name;
    var password = req.body.password;
   
    
    connection.query('insert into users(name, password) values(?, ?)', [name, password], function(err, results){
		// output variable err
		console.log('--- err ---');
		console.log(err);
		console.log('--- err end ---');

		// output variable results
		console.log('--- results ---');
		console.log(results);	
    });
});

// ログイン
router.post('/appLogin', function(req, res){
	var name = req.body.name;
	var password = req.body.password;

	connection.query('select * from users where name = ? and password = ?', [name, password], function(err, results){
		// output variable err
		console.log('--- err ---');
		console.log(err);
		console.log('--- err end ---');

		// output variable results
		console.log('--- results ---');
		console.log(results);	
		console.log('--- results end ---')
	});
    
});

// セッションのチェック
router.post('/checkSession', function(req, res){
   	if(req.sessoin.user){
		// セッションが有効
		// res.send();
	} 
	else {
		// セッションが無効
		// res.send();
	}	
});

// ログアウト
router.post('/appLogout', function(req, res){
  req.session.destroy();
  console.log('deleted session');
  // セッションを無効にしたことを通知
  //res.send();
});

router.get('/logout', function(req, res){
});

module.exports = router;
