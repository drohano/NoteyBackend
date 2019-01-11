var User = require('../models/user');
var Note = require('../models/note');
var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('../config/database');

exports.register = function(req,res){
    var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    var formatEmail = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;
    
    var register = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });
    var fields = register.email.split('@');
    if (format.test(register.userName)){
        return res.status(403).json({success: false, errorCode: 403, errorMessage: "Special characters are not allowed"});
    }
    else if(formatEmail.test(fields[1])){
        return res.status(403).json({success: false, errorCode: 403, errorMessage: "Domain name is invalid"});
    }
    else{
        register.save(function(error){
        //obs hantera error
            if (error){
                if(error.code == 11000){
                    return res.status(409).json({success: false, errorCode: 409, errorMessage: "User name already exists!"});
                }
                else{
                return res.json({success: false, errorCode: 400, errorMessage: "You have to fill all fields!"}); 
                }
                
            }
            res.send('');
        });  
    }
        
    
    
};
exports.create = function(req,res){
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    var create = new Note({
        id: decoded._id,
        heading: req.body.heading,
        content: req.body.content,
        date: req.body.date
        

    });
    create.save(function(error){
        //obs hantera error
            if (error){
                console.log(error);
                return res.status(400).json({success: false, errorCode: 400, errorMessage: "You have to fill all fields!"}); 
                
            }
            res.send('');
        });
}


exports.read = function(req,res){
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    Note.find(function(err, note){
        if (err) return next(err);
        var list = [];

        var id = decoded._id;
        if (!id){
            return res.status(403).json({success: false, errorCode: 403, errorMessage: "No user id provided!"});
        }
        for(var i = 0; i<note.length; i++){
            if(note[i].id == id){
                list.push({id: note[i]._id, heading: note[i].heading, date: note[i].date});
            }
        }
        if((list === undefined || list.length == 0)){
            res.status(403).json({success: false, errorCode: 403, errorMessage: "No notes saved!"});
        }
        else{
            res.send(list);
        }
        
        
        
    });
};

exports.note = function(req,res){
    Note.findById(req.params.id, function(error, note){
        if(error){
            return res.status(403).json({success: false, errorCode: 403, errorMessage: "This note does not exist!"});
        }
        else{
           res.json({id: note._id, heading: note.heading, content: note.content, date: note.date}); 
        }
        
    });
}


exports.update = function(req,res){
    if(req.body.heading == null || req.body.content == null || req.body.date == null){
        return res.status(403).json({success: false, errorCode: 400, errorMessage: "You have to fill all fields!"});
    }
    else{
        Note.findByIdAndUpdate(req.params.id, {heading: req.body.heading, content: req.body.content, date: req.body.date}, {new: true}, (error, note) =>{
            if (error){
                return res.status(400).json({success: false, errorCode: 400, errorMessage: "You have to fill all fields!"}); 
            }
            else{
                res.send(''); 
            }
        
        });
    }
     
}

exports.delete = function(req,res){
    Note.findByIdAndRemove(req.params.id, function(error, note){
        if(error){
            return res.status(403).json({success: false, errorCode: 403, errorMessage: "This note does not exist!"});
        }
        else{
            res.send('');
        }
    });
}

exports.login = function(req,res){
    User.findOne({
        userName: req.body.userName
    }, function(err, user){
        if (err) throw err;

        if(!user){
            return res.status(404).json({success: false, errorCode: 404, errorMessage: "Username or password is not correct!"});
            
            
        } else{
            user.comparePassword(req.body.password, function(err, isMatch){
                if (isMatch && !err){
                    var createdToken = jwt.encode(user, config.secret);
                    res.send('Bearer '+createdToken);
                    
                    
                }else{
                    return res.status(404).json({success: false, errorCode: 404, errorMessage: "Username or password is not correct!"});
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
        res.status(404).json({success: false, errorCode: 404, errorMessage: "You are not logged in!"});
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
