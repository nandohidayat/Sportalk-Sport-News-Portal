var News = require("../models/news"),
    Comment = require("../models/comment"),
    User = require("../models/user");
var middlewareObj = {};

middlewareObj.checkNewsOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        News.findById(req.params.id, function(err, news) {
           if(err) {
               res.redirect("back");
           } else {
               User.findById(news.author.id, function(err, user) {
                   if(err) {
                       res.redirect("back");
                   } else {
                       if(user.role === "admin") {
                           next();
                       } else {
                           res.redirect("back");
                       }
                   }
               });
           }
        }); 
    } else {
        // req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, comment) {
           if(err) {
            //   req.flash("error", "News not found");
               res.redirect("back");
           } else {
               if(comment.author.id.equals(req.user._id)) {
                   next();
               } else {
                   res.redirect("back");
               }
           }
        }); 
    } else {
        // req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    // req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};


middlewareObj.getRandomInt = function(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

module.exports = middlewareObj;