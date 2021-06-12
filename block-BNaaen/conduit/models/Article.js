var mongoose = require("mongoose")

var slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Schema = mongoose.Schema

const articleSchema = new Schema({
    slug: { type: String, slug: "title" },
    title:String,
    description:String,
    body:String,
    tagList:[String],
    favorited:{type:Boolean},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    favoritesCount:Number,
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    articlesCount:Number,
},{timestamps:true})

var Article = mongoose.model("Article",articleSchema)

module.exports = Article