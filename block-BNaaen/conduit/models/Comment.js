var mongoose = require("mongoose")

const Schema = mongoose.Schema

const profileSchema = new Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    articleId :{type: mongoose.Schema.Types.ObjectId, ref: "Article"},
    body:String
},{timestamps:true})

var Profile = mongoose.model("Profile",profileSchema)

module.exports = Profile