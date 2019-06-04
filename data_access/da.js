const Person = require('../models/person');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


function connect2db() {
    mongoose.connect('mongodb://localhost:27017/social_network',
        { useNewUrlParser: true });

    mongoose.connection.once('open', function () {
        console.log("Connection to MongoDB made...");
    }).on('error', function (error) {
        console.log("Error connecting to MongoDB. Error:", error);
    });
}

function savePerson(p, cb) {
    connect2db();
    var p1 = new Person(p);
    p1.update();
    {
        bcrypt.hash(p1.password, 10, function(err, hash){
            p1.password = hash;
            p1.save(function(err){
                if(err) {
                    console.log("Error creating user" + err)
                }
                cb(err);
            });
        });
    }

}


function search(pattern, cb) {
    connect2db();
    Person.find({$or: [
                        {first_name: {$regex: pattern }},
                        {last_name:{$regex: pattern }}
                      ]
    }, function(err, users){
        cb(err, users);
    });
}

function deleteUser(id, cb) {
    connect2db();
    Person.deleteOne({"_id": id}, function (err, res) {
       if(err) {
           console.log("Error deleting user" + err);
       }
       cb(err);
    });
}

function updateUserById(userid, p, cb) {
    connect2db();
    console.log("GOING TO UPDATE USER")
    console.log(userid);
    Person.findByIdAndUpdate({"_id": userid},{ "last_name": p.last_name, "email": p.email});
    console.log("UPDATED: " + userid)
}

function getAllPersons(cb) {
    connect2db();
    Person.find(function(err, users) {
        if(err) {
            console.log('Error getting users' + err);
        }
        cb(err, users);
    });
}


function getFriendsOfUser(user, cb) {
    connect2db();
    var friends_ids = user.friends;
    if(friends_ids.length === 0) {
        cb([]);
    }
    var friends = [];
    var count = 0;
    friends_ids.forEach(function(id){
        Person.findOne({'_id': id}, function(err, friend){
            friends.push(friend);
            count++;
            if(count === friends_ids.length){
                cb(friends);
            }
        });
    });
}

function getPersonByUsername(username, cb) {
    connect2db();
    Person.findOne({'username': username}, function(err, user){
        cb(err, user);
    });
}

function addFriend(userid1, userid2, cb) {
    connect2db();
    Person.findOneAndUpdate({'_id': userid1}, {$push: {'friends': userid2}}, upsert=false, function(err){
        Person.findOneAndUpdate({'_id': userid2}, {$push: {'friends': userid1}}, upsert=false, function(err){
            cb(err);
        });
    });
}

function getPersonById(userid, cb) {
    connect2db();
    Person.findOne({'_id': userid}, function(err, user){
        cb(err, user);
    });
}




module.exports = {
    savePersonFromForm: savePerson,
    findPersons: getAllPersons,
    search: search,
    deleteUser: deleteUser,
    getUserByUsername: getPersonByUsername,
    getUserById: getPersonById,
    updatePersonById: updateUserById,
    addFriend: addFriend,
    getFriendsOfUser: getFriendsOfUser,
};