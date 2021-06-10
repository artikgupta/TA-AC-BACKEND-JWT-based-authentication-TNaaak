var mongoose =require("mongoose");

const Schema = mongoose.Schema

const  BookSchema = new Schema({

    title:String,
    descriptipn:String,
    author:String,
    price:Number,
    pages:Number,
    commentId : [{ type: Schema.Types.ObjectId, ref: 'Comment' }]

}, {timestamps:true})


var Book = mongoose.model('Book', BookSchema);

  module.exports = Book;