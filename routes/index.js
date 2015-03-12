var express = require('express');
var router = express.Router();
var model = require('../model.js'),
    User = model.User;

var loginCheck = function(req, res, next){
  if(req.session.user){
    next();
  } else {
    res.redirect('/login');
  }
};

/* GET home page. */
router.get('/', loginCheck, function(req, res, next) {
  res.render('index', { user: req.session.user });
  console.log(req.session.user);
});

router.get('/login', function(req, res){
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
});

router.post('/add', function(req, res){
  var newUser = new User(req.body);
  newUser.save(function(err){
    if(err){
      console.log(err);
      res.redirect('back');
    } else {
      res.redirect('/');
    }
  });
});

router.get('/logout', function(req, res){
  req.session.destroy();
  console.log('deleted session');
  res.redirect('/');
});

module.exports = router;
