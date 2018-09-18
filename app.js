var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    localStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    User           = require("./models/user"),
    News           = require("./models/news");
    
var indexRoutes = require("./routes/index"),
    newsRoutes  = require("./routes/news");
    
mongoose.connect("mongodb://localhost/sportalk");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(require("express-session")({
    secret: "Change this as you want",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.datetime    = new Date;
//   News.find().sort('-created').exec(function(err, news) {
//       if(err) {
//           console.log(err);
//           res.locals.latest = news;
//       } else {
//           res.locals.latest = news;
//       }
//   });
   News.find().sort('-viewed').exec(function(err, news) {
       if(err) {
           
       } else {
           res.locals.popular = news;
       }
   });
   News.find().sort('-comments').exec(function(err, news) {
       if(err) {
           
       } else {
           res.locals.mostCommented = news;
       }
   });
   next();
});
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRoutes);
app.use("/", newsRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Now listening"); 
});
