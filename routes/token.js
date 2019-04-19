var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:tagId', function(req, res, next) {  
  // session 裡面token還在
  if(req.session.hasOwnProperty('token')){
    res.redirect("/");
  } else {
    // 找不到token 重新導航回 
    res.redirect(`/token/` + req.session.token);
  }
});

module.exports = router;
