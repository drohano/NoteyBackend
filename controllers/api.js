var User = require('../models/user');
var Note = require('../models/note');
var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('../config/database');

exports.create = function(req,res){
    var create = new Note({
        heading: req.body.heading,
        content: req.body.content

    });
    create.save(function(error){
        //obs hantera error
            if (error){
                return res.json({success: false, errorCode: 400, errorMessage: "You have to fill all fields!"}); 
                
            }
            res.send('');
        });
}



exports.register = function(req,res){
    var register = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });
        register.save(function(error){
        //obs hantera error
            if (error){
                if(error.code == 11000){
                    return res.json({success: false, errorCode: 409, errorMessage: "User name already exists!"});
                }
                else{
                   return res.json({success: false, errorCode: 400, errorMessage: "You have to fill all fields!"}); 
                }
                
            }
            res.send('');
        });
    
    
};