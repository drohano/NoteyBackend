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
        var userName = req.body.userName;
        for(var i = 0; i<note.length; i++){
            if(note[i].userName == userName){
                list.push({id: note[i]._id, heading: note[i].heading, date: note[i].date});
            }
        }
        if(list == []){
            res.json({success: false, errorCode: 403, errorMessage: "No notes saved"});
        }
        else{
            res.send(list);
        }
        
        
        
    });
};
exports.login = function(req,res){
    User.findOne({
        userName: req.body.userName
    }, function(err, user){
        if (err) throw err;

        if(!user){
            return res.json({success: false, errorCode: 404, errorMessage: "Username or password is not correct!"});
            
            
        } else{
            user.comparePassword(req.body.password, function(err, isMatch){
                if (isMatch && !err){
                    var createdToken = jwt.encode(user, config.secret);
                    res.send('Bearer '+createdToken);
                    
                    
                }else{
                    return res.json({success: false, errorCode: 404, errorMessage: "Username or password is not correct!"});
                }
            })
        }
    });
};

getToken = function(headers){
    if(headers && headers.authorization){
        var parted = headers.authorization.split(' ');
        if (parted.length === 2){
            return parted[1];
        } else {
            return null;
        }
    }else {
        return null;
    }
}

exports.decode = function(req,res){
    if(!getToken(req.headers)){
        res.json({success: false, errorCode: 404, errorMessage: "You are not logged in!"});
    }
    else{
        var token = getToken(req.headers);
        var decoded = jwt.decode(token, config.secret);
        var userName = decoded.userName;
        var email = decoded.email;
        res.json({userName: userName, email: email});
    }
};

require('../config/passport')(passport);
