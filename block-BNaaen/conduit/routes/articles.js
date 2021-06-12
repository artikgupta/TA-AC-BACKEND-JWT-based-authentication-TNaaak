var express = require('express');
var router = express.Router();

var User = require("../models/User")
var Article = require("../models/Article")

var auth = require('../middleware/auth');
const { verify } = require('jsonwebtoken');


router.post("/", auth.verifyToken,async (req,res, next)=>{
    req.body.author = req.user.userId;
    try {
    let article = await Article.create(req.body)
    console.log(req.body)
    res.json({ article:article});
    } catch (error) {
        next(error)
    }
    
})

// feed

router.get('/feed', auth.verifyToken, async (req, res, next) => {
    let loggedinUserId = req.user.userId;
  
    try {
      var user = await User.findById(loggedinUserId);
      var article = await Article.find({ author: { $in: user.followings } })
        .sort({ createdAt: -1 })
        .populate('author', 'username bio image');
  
      res.json({
        articles: article,
      });
    } catch (error) {
      next(error);
    }
  });
  

router.get("/:slug", async(req,res,next)=>{
    let slug = req.params.slug;
    try {
        let slugArticle = await Article.find({slug})
        console.log(slug)
        res.json({ slugArticle});

    } catch (error) {
        next(error)
    }
})

// update the article

router.put("/:slug", auth.verifyToken, async(req,res, next)=>{
    let slug = req.params.slug
   try {

    let article = await Article.findOne({slug:slug})
    if(req.user.userId === article.author){
        var updatedArticle = await Article.findByIdAndUpdate({slug:slug},req.body)
        res.json(updatedArticle)
    }else{
        res.status(400).json({
            error: 'You are not authorized to update',
          });
    }
       
   } catch (error) {
       next(error)
   }
})


// create comment 

router.post("/:slug/comments",auth.verifyToken, async(req,res,next)=>{
    let slug = req.params.slug
    req.body.comments.author = req.user.userId;
    try {
        var article = await Article.findOne({slug:slug})
        req.body.comments.articleId = article.id;
        var comment = await Comment.create(req.body.comments)

     var updatedArticle = await Article.findByIdAndUpdate(article._id, {
        $push: { comments: comment._id },
      });
      var populatedComment = await Comment.findById(comment._id)
        .populate('author', '-_id bio image username following')
        .exec();
  
      res.json({comments: populatedComment});
    } catch (error) {
      next(error);
    }
  
})

// list all comments of article

router.get('/:slug/comments', async (req, res, next) => {
    let slug = req.params.slug;
  
    try {
      var article = await Article.findOne({ slug: slug });
  
      var comments = await Comment.find({ articleId: article._id }).populate(
        'author','_id name bio email username image'
      );
      res.json({
        comments: comments,
      });
    } catch (error) {
      next(error);
    }
  });


  // delete article

router.delete('/:slug', auth.verifyToken, async (req, res, next) => {
    let slug = req.params.slug;
    let userId = req.user.userId;
  
    try {
      var article = await Article.findOne({ slug: slug });
  
      if (userId == article.author) {
        var deletedArticle = await Article.findOneAndDelete({ slug: slug });
        var comments = await Comment.deleteMany({ articleId: article._id });
      } else {
        return res.json(400).json({
          error: 'You are not authorized',
        });
      }
    } catch (error) {
      return next(error);
    }
  });



//   favorite article

router.post('/:slug/favorite', auth.verifyToken, async (req, res, next) => {
    let slug = req.params.slug;
    let loggedinUser = req.user.userId;
    var user = await User.findById(loggedinUser);
  
    try {
      var article = await Article.findOne({ slug: slug })
        .populate('author', 'username bio image following')
        .exec();
  
      console.log(article, 'textttttttttttttttttttt');
      if (!article.favouritedBy.includes(loggedinUser)) {
        article.favouritedBy.push(loggedinUser);
  
        article.favoritesCount += 1;
        article.save();
        article.favourite = true;
        res.json({
          article: article.toJSONFor(user),
        });
      }
    } catch (error) {
      next(error);
    }
  });
  
  // unfavorite article
  
  router.delete('/:slug/favorite', auth.verifyToken, async (req, res, next) => {
    let slug = req.params.slug;
    let loggedinUser = req.user.userId;
    var user = await User.findById(loggedinUser);
  
    try {
      var article = await Article.findOne({ slug: slug })
        .populate('author')
        .exec();
      console.log(article, 'articleeeeee');
      if (article.favouritedBy.includes(loggedinUser)) {
        article.favouritedBy.pull(loggedinUser);
  
        article.favoritesCount -= 1;
        article.save();
        article.favourite = false;
        res.json({
          article: article.toJSONFor(user),
        });
      }
    } catch (error) {
      next(error);
    }
  });


module.exports = router;