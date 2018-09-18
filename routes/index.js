var express  = require("express"),
    router   = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    News = require("../models/news"),
    middleware = require("../middleware");

router.get("/", function(req, res) {
    News.find({category: "Football"}).sort({created: 'desc'}).exec(function(err, football) {
        if(err) {
            console.log(err);
        } else {
            News.find().sort({created: 'desc'}).exec(function(err, latest) {
                if(err) {
                    
                } else {
                    News.find().sort({viewed: 'desc'}).exec(function(err, viewed) {
                       if(err) {
                           
                       } else {
                           News.find().sort({comments: 'desc'}).exec(function(err, mostCommented) {
                               if(err) {
                                   
                               } else {
                                   News.find({category: "Boxing"}).sort({created: 'desc'}).exec(function(err, boxing) {
                                        if(err) {
                                        } else {
                                            News.find({category: "eSport"}).sort({created: 'desc'}).exec(function(err, esport) {
                                                if(err) {
                                                    
                                                } else {
                                                    res.render("home", {football: football, latest: latest, viewed: viewed, mostCommented: mostCommented, boxing: boxing, esport: esport});         
                                                }
                                            });
                                            
                                        }
                                   });
                               }
                           });
                       }
                   });
                }
            });
        }
    });
});

router.get("/register", function(req, res) {
   res.render("signup"); 
});

router.post("/register", function(req, res) {
    var newUser = new User({
        email: req.body.email, 
        username: req.body.username,
        role: "user",
        image: "img/profile/" + middleware.getRandomInt(9) + ".png"
    });
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            // req.flash("error", err.message);
            console.log(err);
            return res.redirect("/register");
        }
        console.log(user);
        passport.authenticate("local")(req, res, function() {
            // req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/");
        });
    });
});

router.get("/login", function(req, res) {
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/", 
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true
}), function(req, res) {
});

router.get("/logout", function(req, res) {
   req.logout();
//   req.flash("success", "Logged you out!");
   res.redirect("/");
});

module.exports = router;