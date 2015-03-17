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

// output console request
var output = function(req, res, next){
	//console.log('--- variable req ---');
	//console.log(req);
	//console.log('--- end req ---');

	console.log('--- variable req.body ---');
	console.log(req.body);
	console.log('--- end req.body ---');

	next();
};

// Index.html
router.get('/', loginCheck, function(req, res, next) {
  res.render('index', { user: req.session.user });
  console.log(req.session.user);
});

// ログイン処理を行うlogin.html
router.get('/login', output, function(req, res){
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

// browser用のログイン処理
router.post('/login', output, function(req, res){
	
	connection.query('select * from users where (name = ?) and (password = ?)', [req.body.name, req.body.password], function(err, results){

        if(err){
           // エラー時の処理
            console.log(err);
        }
	// ユーザー名とパスワードが一致(resultsに値が格納されている)
         if(results.toString() !== ''){
             req.session.user = req.body.name;
             res.redirect('/');
         } else {
             res.render('login');
         }
         
        console.log(results);
    });
});

// ユーザーの登録を行うPOSTの処理
router.post('/add', output, function(req, res){

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

router.get('/logout', output, function(req, res){
  req.session.destroy();
  console.log('deleted session');
  res.redirect('/');
});


// Routing of Application

// アカウント登録
router.post('/appCreate', output, function(req, res) {
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
		console.log('--- r ---');
		console.log(r);	
		console.log('--- r end ---');
		console.log('--- r.toString ---');
		console.log(r.toString());
		console.log('--- r.toString end ---');
			if(r.toString() !== ''){
				console.log('in if');
				return true;
			} else {
				console.log('in else');
				return false;
			}
		};

		var response = {
			"result": r = checkResult(results),
			"err": !r ? "cannot create new account" : null
		};

        
		req.session.user = req.body.name;
		res.send(response);
    });
});

// Login for application
router.post('/appLogin', output, function(req, res){
	var name = req.body.name;
	var password = req.body.password;
	console.log('name : ' + name);
	console.log('password : ' + password);

	connection.query('select * from users where (name = ?) and (password = ?)', [name, password], function(err, results){
		// output variable err
		console.log('--- err ---');
		console.log(err);
		console.log('--- err end ---');

		// output variable results
		console.log('--- results ---');
		console.log(results);	
		console.log('--- results end ---');
		console.log('--- results.toString ---');
		console.log(results.toString());
		console.log('--- results.toString end ---');
        
		var checkResult = function(r){
		console.log('--- r ---');
		console.log(r);	
		console.log('--- r end ---');
		console.log('--- r.toString ---');
		console.log(r.toString());
		console.log('--- r.toString end ---');
			if(r.toString() !== ''){
				console.log('in if');
				return true;
			} else {
				console.log('in else');
				return false;
			}
		};

		var response = {
			"result": r = checkResult(results),
			"err": !r ? "cannot login" : null
		};
        
		req.session.user = req.body.name;
		res.send(response);
	});
    
});

// セッションのチェック
router.post('/checkSession', output, function(req, res){
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
router.post('/appLogout', output, function(req, res){
  req.session.destroy();
  console.log('deleted session');
  // セッションを無効にしたことを通知
  var response = {
    "result": true
  };
  res.send(response);
});

module.exports = router;
