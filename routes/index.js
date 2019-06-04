var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var userid = req.session['userid'];
  res.render('index', { title: 'Bil', userid: userid });
});

module.exports = router;
