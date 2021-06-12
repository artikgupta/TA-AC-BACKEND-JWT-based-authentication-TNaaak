var mongoose = require("mongoose")

var jwt = require('jsonwebtoken');

const Schema = mongoose.Schema

var bcrypt = require("bcrypt")

const userSchema = new Schema({
    email: String,
    username:String,
    bio:String,
    password:String,
    image:String,
},{timestamps:true})


userSchema.pre('save', async function (next) {
    if (this.password && this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });
  

  userSchema.methods.verifyPassword = async function (password) {
    try {
      var result = await bcrypt.compare(password, this.password);
      return result;
    } catch (error) {
      return error;
    }
  };
  
  userSchema.methods.signToken = async function () {
    var payload = { userId: this.id, email: this.email };
    try {
      var token = await jwt.sign(payload, 'secret');
      return token;
    } catch (error) {
      return error;
    }
  };
  userSchema.methods.userJSON = function (token) {
    return {
      username: this.username,
      email: this.email,
      token: token,
    };
  };





var User = mongoose.model("User",userSchema)

module.exports = User