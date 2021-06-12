var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middleware/auth');


// 

router.get("/:username", async (req, res, next) => {
    const username = req.params.username;
    try {
      const profile = await User.findOne({ username })
      if (profile) {
        res.json({ profile: { ...profile(user, req.userID) }})
      } else {
        throw new Error("invalid-02")
      }
    } catch (error) {
      next(error)
    }
  })


  router.post('/:username/follow', auth.verifyToken, async (req, res, next) => {
    var username = req.params.username;
    console.log(req.user);
    try {
      let loggedinUserId = req.user.userId;
      var loggedinUser = await User.findOne({ _id: loggedinUserId });
      var userToBeUpdated = await User.findOne({ username });
      var followersList = userToBeUpdated.followers;
      if (!followersList.includes(loggedinUserId)) {
        userToBeUpdated.followers.push(loggedinUserId);
  
        userToBeUpdated.save();
      }
      if (!loggedinUser.followings.includes(userToBeUpdated._id)) {
        loggedinUser.followings.push(userToBeUpdated._id);
        loggedinUser.save();
      }
      res.json({ profile: loggedinUser.followingJSON(userToBeUpdated) });
    } catch (error) {
      next(error);
    }
  });
  
  router.delete('/:username/follow', auth.verifyToken, async (req, res, next) => {
    var username = req.params.username;
    try {
      var loggedinUserId = req.user.userId;
      var loggedinUser = await User.findOne({ _id: loggedinUserId });
      var userToBeUpdated = await User.findOne({ username });
  
      var followersList = userToBeUpdated.followers;
      if (followersList.includes(req.user.userId)) {
        userToBeUpdated.followers.pull(req.user.userId);
  
        userToBeUpdated.save();
      }
      if (loggedinUser.followings.includes(userToBeUpdated._id)) {
        loggedinUser.followings.pull(userToBeUpdated._id);
        loggedinUser.save();
      }
      res.json({ profile: loggedinUser.followingJSON(userToBeUpdated) });
    } catch (error) {
      next(error);
    }
  });


module.exports = router;