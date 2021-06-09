var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.post("/register", async (req,res, next)=>{
    try {
        var user = await User.create(req.body)
        req.statusCode(201).json({user})
    } catch (error) {
        next(error)
    }
})

router.post("/login",async (req,res, next)=>{
        var {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({error:"Email/Password required"})
        }

        try {
            var user = await User.findOne({email})
            if(!user){
                return res.status(400).json({error:"Email not registered"})
            }
            var result = await User.verifyPassword(password)
            if(!result){
                return res.status(400).json({error:"Invalid Password"})
            }
            var token = await user.signToken();
            res.json({ user: user.userJSON(token) });
        
        } catch (error) {
            next(error)
        }
    
})






module.exports = router;