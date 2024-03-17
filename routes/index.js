var express = require('express');
var router = express.Router();
const UserModel = require('./users');
const postModel = require('./posts');
const localStrategy = require('passport-local'); //The Passport local strategy is initialized with UserModel.authenticate().
// This assumes UserModel has an authenticate method, which is typically provided by passport-local-mongoose if you're using it in your user schema. 
const passport = require('passport');
const upload = require('./multer');


passport.use(new localStrategy(UserModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
   const user = await UserModel.findOne({
    username : req.session.passport.user
   })
   .populate("posts")

  res.render('profile' ,{user});
});

router.get('/login', function(req, res, next) {
  
  res.render('login',{error: req.flash('error')});
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});


router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post('/upload',isLoggedIn, upload.single('file'), async function(req, res, next) {
  if(!req.file){
    return res.status(400).send("There was an error uploading the file.");
  }
  const user = await UserModel.findOne({username:req.session.passport.user});
  const post = await postModel.create({
    image : req.file.filename,
    postText : req.body.filecaption, 
    user: user._id
  })
  console.log(user);
  user.posts.push(post._id)
  await user.save()
  res.redirect('/profile');
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
  failureRedirect: '/login', 
  failureFlash: true
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
