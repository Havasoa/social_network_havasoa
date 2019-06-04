var express = require('express');
var router = express.Router();
var da = require('../data_access/da');


/* GET users listing. */
router.get('/', function(req, res, next) {
  da.findPersons(function(err, users) {
    var userid = req.session['userid'];
    if(userid){
      console.log("HELLO PRINT");
      da.getUserById(userid, function(err, user){
        res.render('users/users', {title:'User listing', user_list: users, userid: userid, friends: user.friends});
      });
    }
    else {
      console.log("HELLO PRINT ELSE");
      res.render('users/users', {title:'User listing', user_list: users, userid: userid, friends: []});
    }

  });
});

router.post('/', function(req, res, next) {
  console.log("POSTING");

  var userid = req.query.id;

  req.query.find({"_id" : userid}, function(err, docs){
    if(docs.length) {
      res("User exist will update");
      da.updatePersonById(userid,  req.body,function(err, user) {
        console.print("UPDATING " + userid);
        res.redirect('/users')
      });
    } else {
      da.savePersonFromForm(req.body, function(err) {
        res.redirect('/users');
      });
    }
  });
});

router.get('/add', function(req, res){
  var userid = req.session['userid'];
  res.render('users/add', {title: 'Add User', userid: userid});
});

router.get("/edit", function(req, res){
  var userid = req.query.id;
  console.log("GOING TO UPDATE PERSON");
  userToUpdate = da.getUserById(req.query.id, function(err, user){
    res.render("users/edit", { title: 'Edit User', userid: userid, user: user })
  });
});

router.get('/delete', function(req, res){
  da.deleteUser(req.query.id, function(err){
    res.redirect('/users');
  });
});

router.get('/add_friend', function(req, res){
  da.addFriend(req.session['userid'], req.query.id, function(err){
    res.redirect('/users');
  });
});

module.exports = router;
