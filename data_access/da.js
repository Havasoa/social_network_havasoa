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

function savePerson(p) {
    connect2db();
    var p1 = new Person(p);
    bcrypt.hash(p1.password, 10, function(err, hash){
        p1.password = hash;
        p1.save();
    });

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

module.exports = {
    savePersonFromForm: savePerson,
    findPersons: getAllPersons
};