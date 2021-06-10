var express = require("express")

var router = express.Router()

var Book =  require("../models/Book")

var Comment = require("../models/Comment")

var auth = require('../middleware/auth');

router.use(auth.verifyToken);


// create

router.post("/create",auth.verifyToken, (req,res,next)=>{
Book.create(req.body, (err, book)=>{
    if(err) return next(err)
    res.json(book)
})
})

// listof all books

router.get("/", (req,res, next)=>{
    Book.find({}, (err, book)=>{
        if(err) return next(err)
        res.json(book)
    })
})


// single book

router.get("/:id", (req, res, next)=>{
    let id = req.params.id
    Book.findById(id, (err, book)=>{
        if(err) return next(err)
        res.json(book)
    })
})

// update a book

router.put("/:id/edit", (req, res, next)=>{
    let id = req.params.id
    Book.findByIdAndUpdate(id, req.body, {new:true}, (err, book)=>{
        if(err) return next(err)
        res.json(book)
    })
})

// delete a book

router.delete("/:id/delete", (req, res, next)=>{
    let id = req.params.id
    Book.findByIdAndDelete(id, (err, book)=>{
        if(err) return next(err)
        res.json(book)
    })
})



// router.post("/:id/comment", (req, res,next)=>{
//     let id = req.params.id;
//     Comment.create(req.body, (err, comment)=>{
//         if(err) return next(err);
//     Book.findByIdAndUpdate(id, {$push:{commentId:comment.id}}, (err, comment)=>{
//         if(err) return next(err);
//         res.send("comment")
//     })
   
//     })

// })

router.post("/:id/comment", async (req,res,next)=>{
    let id = req.params.id;
    try {
       let comment =  await Comment.create(req.body);
       let book = await (await Book.findByIdAndUpdate(id, {$push:{commentId:comment.id}})).populate("commentId")
       res.json(book)
    } catch (error) {
         return next(error)
    }

})

// category

router.get('/category', (req, res, next) => {
    Book.distinct('category').exec((err, result) => {
      if (err) return next(err);
      console.log(result, 'hi');
      res.json(result);
    });
  });


  
  router.get('/category/books', (req, res, next) => {
    Book.aggregate([
      {
        $unwind: '$category',
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]).exec((err, book) => {
      res.json(book);
    });
  });







module.exports= router;