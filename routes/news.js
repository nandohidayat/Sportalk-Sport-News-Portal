var express = require("express"),
    router  = express.Router(),
    News    = require("../models/news"),
    User    = require("../models/user"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");
    
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("news/new"); 
});

router.post("/", middleware.isLoggedIn, function(req, res) {
   var news = req.body.news;
   news.author = {
       id: req.user._id,
       username: req.user.username
   };
   news.viewed = 0;
   News.create(news, function(err,  newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/");       
        }
   });
   
});

router.get("/:category/:id/:name", function(req, res) {
    News.findById(req.params.id).populate("comments").exec(function(err, news) {
        if(err) {
            console.log(err);
        } else {
            news.viewed = news.viewed + 1;
            news.save();
            News.find().sort('-created').exec(function(err, latest) {
                if(err) {
                    
                } else {
                    News.find().sort('-viewed').exec(function(err, viewed) {
                       if(err) {
                           
                       } else {
                           News.find().sort('-comments').exec(function(err, mostCommented) {
                               if(err) {
                                   
                               } else {
                                   News.find({category: req.params.category}).sort('-created').exec(function(err, related) {
                                       if(err) {
                                           
                                       } else {
                                           res.render("news/single", {news: news, latest: latest, viewed: viewed, mostCommented: mostCommented, related: related});
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

router.get("/:category/:id/:name/edit", middleware.isLoggedIn, function(req, res) {
    News.findById(req.params.id, function(err, news) {
        if(err) {
            console.log(err);
        } else {
            res.render("news/edit", {news: news});
        }
    });
});

router.put("/:category/:id/:name/", middleware.checkNewsOwnership, function(req, res) {
    News.findByIdAndUpdate(req.params.id, req.body.news, function(err, news) {
        if(err) {
            res.redirect("/");
        } else {
            res.redirect("/" + news.category + "/" + news._id + "/" + news.name);
        }
    });
});

router.delete("/:category/:id/:name/", middleware.checkNewsOwnership, function(req, res) {
   News.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           console.log(err);
       } else {
           res.redirect("/");
       }
   });  
});

router.delete("/:category/:id/:name/:comment", function(req, res) {
   Comment.findByIdAndRemove(req.params.comment, function(err) {
       if(err) {
           console.log(err);
       } else {
           res.redirect("/" + req.params.category + "/" + req.params.id + "/" + req.params.name);
       }
   });  
});

router.post("/:category/:id/:name/comment", middleware.isLoggedIn, function(req, res) {
    News.findById(req.params.id, function(err, news) {
        if(err) {
            console.log(err);
            res.redirect("/");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                    res.redirect("/new");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.image = req.user.image;
                    comment.save();
                    
                    news.comments.push(comment._id);
                    news.save();
                    res.redirect("/" + news.category + "/" + news._id + "/" + news.name);
                }
            });
        }
    });
});

router.get("/:category", function(req, res) {
    News.find({category: req.params.category}).sort('-created').exec(function(err, category) {
        if(err) {
            console.log(err);
        } else {
            News.find().sort('-created').exec(function(err, latest) {
                if(err) {
                    
                } else {
                    News.find().sort('-viewed').exec(function(err, viewed) {
                       if(err) {
                           
                       } else {
                           News.find().sort('-comments').exec(function(err, mostCommented) {
                               if(err) {
                                   
                               } else {
                                   res.render("news/category", {category: category, latest: latest, viewed: viewed, mostCommented: mostCommented});
                               }
                           });
                       }
                   });
                }
            });
        }
    });
});  

module.exports = router;