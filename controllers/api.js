var User = require('../models/user');
var Note = require('../models/note');
var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('../config/database');

// HTML characters to escape 
var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

// Code from mustache.js
// Escapes HTML characters in strings
function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

function escapeScript (string){
    return String(string).replace(/<script>/gi,'&ltscript&gt').replace(/<\/script>/gi,'&lt&#x2fscript&gt');
}

exports.register = function (req, res) {
    var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    var formatEmail = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/;

    var register = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });
    var fields = register.email.split('@');
    if (format.test(register.userName)) {
        return res.status(403).json({
            errorCode: 1.0,
            errorMessage: "[register] register.userName format is mismatched"
        });
    }
    else if (formatEmail.test(fields[1])) {
        return res.status(403).json({
            errorCode: 1.1,
            errorMessage: "[register] register domain format is mismatched"
        });
    }
    else {
        register.save(function (error) {
            //obs hantera error
            if (error) {
                if (error.code == 11000) {
                    return res.status(409).json({
                        errorCode: 1.3,
                        errorMessage: "[register] userName already exist in database"
                    });
                }
                else {
                    return res.status(400).json({
                        errorCode: 1.4,
                        errorMessage: "[register] not filled all required fields"
                    });
                }
            }
            res.send('');
        });
    }
};

exports.create = function (req, res) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    var create = new Note({
        id: decoded._id,
        heading: escapeScript(req.body.heading),
        content: escapeScript(req.body.content),
        date: escapeScript(req.body.date)
    });
    // Unsure if this is the correct placement for error handling.
    // Check if heading exceeds 50 character limit
    if (req.body.heading.length > 50) {
        // Unsure what status code to use.
        return res.status(400).json({
            errorCode: 2.1,
            errorMessage: "[create] heading can't be more than 50 characters"
        });
    };

    // This one is for create Notey function.
    // If heading or content doesnt exist it will spitt this out.
    // Both need to have a value.
    create.save(function (error) {
        if (error) {
            console.log(error);
            return res.status(400).json({
                errorCode: 2.0,
                errorMessage: "[create] not filled heading or/and content"
            });
        }
        res.send('');
    });
}

exports.read = function (req, res) {
    var token = getToken(req.headers);
    var decoded = jwt.decode(token, config.secret);
    Note.find(function (err, note) {
        if (err) return next(err);
        var list = [];

        // This one is for reading Tokens.
        var id = decoded._id;
        if (!id) {
            return res.status(403).json({
                errorCode: 3.0,
                errorMessage: "[read] token not found"
            });
        }

        for (var i = 0; i < note.length; i++) {
            if (note[i].id == id) {
                list.push({ id: note[i]._id, heading: note[i].heading, content: note[i].content , date: note[i].date });
            }
        }

        // This one is for list notey's function.
        // If there is no Notey's it will spit this out.
        if ((list === undefined || list.length == 0)) {
            res.status(403).json({
                errorCode: 3.1,
                errorMessage: "[read] notey notes count is 0/undefined"
            });
        }
        else {
            res.send(list);
        }
    });
};

// If it cant find the noteyID.  
exports.note = function (req, res) {
    Note.findById(req.params.id, function (error, note) {
        if (error) {
            return res.status(403).json({
                errorCode: 4.0,
                errorMessage: "[note] noteId could not be found"
            });
        }
        else {
            res.json({ id: note._id, heading: note.heading, content: note.content, date: note.date });
        }
    });
}

exports.update = function (req, res) {
    // This one is for updateSave.
    // If heading or content doesnt exist it will spitt this out. 
    if (req.body.heading == null || req.body.content == null || req.body.date == null) {
        return res.status(400).json({
            errorCode: 2.0,
            errorMessage: "[update] not filled all required fields"
        });
    }
    // Check if heading exceeds 50 character limit
    else if (req.body.heading.length > 50) {
        // Unsure what status code to use.
        return res.status(400).json({
            errorCode: 2.1,
            errorMessage: "[update] heading can't be more than 50 characters"
        });
    }
    else {
        Note.findByIdAndUpdate(req.params.id, { heading: escapeScript(req.body.heading), content: escapeScript(req.body.content), date: escapeScript(req.body.date) }, { new: true }, (error, note) => {
            // If it couldn't update it will spit this out.
            if (error) {
                return res.status(400).json({
                    errorCode: 5.0,
                    errorMessage: "[update] note content failed to update"
                });
            }
            else {
                res.send('');
            }
        });
    }
}

exports.delete = function (req, res) {
    Note.findByIdAndRemove(req.params.id, function (error, note) {
        if (error) {
            // If it cant find the noteyID. 
            return res.status(403).json({
                errorCode: 4.0,
                errorMessage: "[delete] noteId could not be found"
            });
        }
        else {
            res.send('');
        }
    });
}

exports.login = function (req, res) {
    User.findOne({
        userName: req.body.userName
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            // If the username doesn't exist
            return res.status(404).json({
                errorCode: 6.0,
                errorMessage: "[login] login userName does not exist"
            });
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var createdToken = jwt.encode(user, config.secret);
                    res.send('Bearer ' + createdToken);
                } else {
                    // If the username and password doesn't match. 
                    return res.status(404).json({
                        errorCode: 6.1,
                        errorMessage: "[login] login userName and password mismatch"
                    });
                }
            })
        }
    });
};

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

exports.decode = function (req, res) {
    if (!getToken(req.headers)) {
        // This one is for a possibly profile view.
        // If you're not logged in it will spit this out. 
        res.status(404).json({
            errorCode: 7.0,
            errorMessage: "[decode] user is not logged in"
        });
    }
    else {
        var token = getToken(req.headers);
        var decoded = jwt.decode(token, config.secret);
        var userName = decoded.userName;
        var email = decoded.email;
        res.json({ userName: userName, email: email });
    }
};

require('../config/passport')(passport);
