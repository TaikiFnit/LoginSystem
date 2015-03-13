var express = require('express');
var router = express.Router();
var model = require('../model.js'),
    User = model.User;
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: 'mod1_user',
  password: process.env.DB_PASS || 'IRC2015',
  database: process.env.DB_NAME || 'mod1_DB'
});

// Catch data from Database and output console
connection.query('select * from messages', function(err, results, fields){
		// output results		
		console.log('Connection Test to MySQL from messages');
		console.log('---results---');
		console.log(results);
		console.log('---result end---');
		//console.log('---fields---');
		//console.log(fields);
		//console.log('---fields end---');
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

// Routing of browser

var loginCheck = function(req, res, next){
  if(req.session.user){
    next();
  } else {
    res.redirect('/login');
  }
};

// Index.html
router.get('/', loginCheck, function(req, res, next) {
  res.render('index', { user: req.session.user });
  console.log(req.session.user);
});

// ログイン処理を行うlogin.html
router.get('/login', function(req, res){
    /* mysql */
    if(req.session.user){
        res.redirect('/');
    }
    
    res.render('login');
    
    
  /* mongdb
  var email = req.query.email;
  var password = req.query.password;
  var query = { "email": email, "password": password };
  User.find(query, function(err, data){
    if(err){
      console.log(err);
    }
    if(data == ""){
      res.render('login');
    } else {
      req.session.user = email;
      res.redirect('/');
    }
  });
  */
});

router.post('/login', function(req, res){
     connection.query('select * from users where name = ? and password = ?', [req.body.name, req.body.password], function(err, results){
        if(err){
           // エラー時の処理
            console.log(err);
        }
         // ユーザー名とパスワードが不一致
         if(results === ''){
             res.render('login');
         } else {
             req.session.user = req.body.name;
             res.redirect('/');
         }
         
        console.log(results);
    });
});

// ユーザーの登録を行うPOSTの処理
router.post('/add', function(req, res){

  console.log(req.body);

  /* mysql */
  connection.query('insert into users(name, password) values(?, ?)', [req.body.name, req.body.password], function(err, results){
      if(err){
        // エラー時の処理
        console.log(err);
        res.redirect('back');
      } else {
          res.redirect('/');
      }
  });

  /* mongdb
  var newUser = new User(req.body);
  newUser.save(function(err){
    if(err){
      console.log(err);
      res.redirect('back');
    } else {
      res.redirect('/');
    }
  });
  */
});

router.get('/logout', function(req, res){
  req.session.destroy();
  console.log('deleted session');
  res.redirect('/');
});


// Routing of Application

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

		var checkResult = function(r){
			if(results){
				return true;
			} else {
				return false;
			}
		};

		var response = {
			"result": checkResult(results),
			"err": err
		};
	//	req.session.user = req.body.name;
		res.send(response);
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

		// ログインに成功したかどうかをreturnする(しなければならない)関数 (現在は実装できてない)
		var checkResult = function(r){
			console.log('r.name');	
			console.log(r.name);
			console.log('results.name');
			console.log(results.name);
			console.log('req.body.name');
			console.log(req.body.name);
			if(r.name == req.body.name){
				console.log('in results if');
				console.log(r);
				return true;
			} else {
				console.log('in results else');
				console.log(r);
				return false;
			}
		};

		var response = {
			"result": checkResult(results),
			"err": err
		};
	//	req.session.user = req.body.name;
		res.send(response);

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
  var response = {
    "result": true
  };
  res.send(response);
});

module.exports = router;
