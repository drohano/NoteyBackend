var User = require('../models/user');
var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('../config/database');


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