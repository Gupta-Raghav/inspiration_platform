var express = require('express');
var router = express.Router();
const UserModel = require('./users');
const postModel = require('./posts');
const localStrategy = require('passport-local'); //The Passport local strategy is initialized with UserModel.authenticate().
const passport = require('passport');
// This assumes UserModel has an authenticate method, which is typically provided by passport-local-mongoose if you're using it in your user schema. 
passport.use(new localStrategy(UserModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('profile');
});

router.get('/login', function(req, res, next) {
  res.render('login',{title: 'login'});
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});


router.post("/register", function(req, res, next){
  const {username, email, fullname} = req.body;
  UserModel.register(new UserModel({username, email, fullname}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render('index', { title: 'Registration Error' });
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect('/profile');
    });
  });
});



router.post("/login", passport.authenticate("local", {
  successRedirect : '/profile', 
  failureRedirect: '/login'
}), function(req, res, next){
  res.render('login');
});


router.get("/logout", function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated())return next();
  res.redirect("/login");
}

module.exports = router;
