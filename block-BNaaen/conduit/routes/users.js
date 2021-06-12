var express = require('express');
var router = express.Router();

var User = require("../models/User")

var auth = require('../middleware/auth');

/* GET users listing. */
router.get('/', auth.verifyToken,async(req, res, next) => {

var {email,userId} = req.user;
var token = req.user.token;
console.log(email, userId)
try {

  var user = await User.findById(userId);
  res.json({user:user.userJSON(token)})
  
} catch (error) {
  next(error)
}


});

router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    console.log(user);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email/password required',
    });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: 'Email not registered',
      });
    }
    var result = await user.verifyPassword(password);
    console.log(user, result);
    if (!result) {
      return res.status(400).json({
        error: 'Invalid password',
      });
    }
    // generate token
    var token = await user.signToken();
    res.json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

// update a user 

router.put("/", auth.verifyToken,async(req,res,next)=>{

  let id = req.user.userId
  try {
    let updatedUser = await User.findByIdAndUpdate(id, req.body) 
    console.log(updatedUser)
    var user = await User.findById(id )
    res.json({user})
  } catch (error) {
    
  }

})


module.exports = router;
