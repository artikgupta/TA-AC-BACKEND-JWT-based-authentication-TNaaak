
var mongoose =require("mongoose");

const Schema = mongoose.Schema

const CommentSchema = new Schema({

comment :String,

bookId:{ type: Schema.Types.ObjectId, ref: 'Books' },
}, {timestamps:true})


var Comment = mongoose.model('Comment', CommentSchema);

  module.exports = Comment;