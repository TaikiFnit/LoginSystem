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

module.exports = router;
