var express = require("express");

var router = express.Router()

var Book =  require("../models/Book")

var Comment = require("../models/Comment")



    
    // listof all comments
    
    router.get("/", (req,res, next)=>{
        Comment.find({}, (err, comment)=>{
            if(err) return next(err)
            res.json(comment)
        })
    })
    
    
    // single comment
    
    router.get("/:id", (req, res, next)=>{
        let id = req.params.id
        Comment.findById(id, (err, comment)=>{
            if(err) return next(err)
            res.json(comment)
        })
    })
    
    // update a comment
    
    router.put("/:id/edit", (req, res, next)=>{
        let id = req.params.id
        Comment.findByIdAndUpdate(id, req.body, {new:true}, (err, comment)=>{
            if(err) return next(err)
            res.json(comment)
        })
    })
    
    // delete a comment
    
    router.delete("/:id/delete", (req, res, next)=>{
        let id = req.params.id
        Comment.findByIdAndDelete(id, (err, comment)=>{
            if(err) return next(err)
            res.json(comment)
        })
    })
    










module.exports= router;
