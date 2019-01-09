var User = require('../models/user');
var Note = require('../models/note');
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

exports.create = function(req,res){
    var create = new Note({
        userName: req.body.userName,
        heading: req.body.heading,
        content: req.body.content,
        date: req.body.date
        

    });
    create.save(function(error){
        //obs hantera error
            if (error){
                console.log(error);
                return res.json({success: false, errorCode: 400, errorMessage: "You have to fill all fields!"}); 
                
            }
            res.send('');
        });
}


exports.read = function(req,res){
    Note.find(function(err, note){
        if (err) return next(err);
        var list = [];
        for(var i = 0; i<note.length; i++){
            list.push({id: note[i]._id, heading: note[i].heading, date: note[i].date});
        }
        res.send(list);
        
        
    });
};