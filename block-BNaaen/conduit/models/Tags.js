var mongoose = require("mongoose")

const Schema = mongoose.Schema

const tagsSchema = new Schema({
   tags:[String]
},{timestamps:true})

var Tags = mongoose.model("Tags",tagsSchema)

module.exports = Tags