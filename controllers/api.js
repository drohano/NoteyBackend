var User = require('../models/user');
var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('../config/database');
var passed = false;
var token;

exports.register = function(req,res){
    var register = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });

    
    register.save(function(error){
        //obs hantera error
        if (error){
            return next(error);
        }
        res.send('');
    });
};