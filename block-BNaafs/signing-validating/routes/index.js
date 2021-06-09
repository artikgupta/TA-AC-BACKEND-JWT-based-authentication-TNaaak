var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use(auth.verifyToken);

router.get("/protected", (req,res,next)=>{
  req.json({message:"Protected Content"})
})

module.exports = router;
