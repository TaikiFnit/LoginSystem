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

var loginCheck = function(req, res, next){
  if(req.session.user){
    next();
  } else {
    res.redirect('/login');
  }
};

// アカウント登録
router.post('/appCreate',  function(req, res) {
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
