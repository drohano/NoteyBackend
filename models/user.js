var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    userName: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    password: {type: String, required: true, max: 100}
});

UserSchema.pre('save', function (next) {
    var user = this;
    
    bcrypt.hash(user.password, null, null, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });
  
  UserSchema.methods.comparePassword = function(passw, cb){
    bcrypt.compare(passw, this.password, function(err, isMatch){
      if(err){
        return cb(err);
  
      }
      cb(null, isMatch);
    });
  };
module.exports = mongoose.model('User', UserSchema, "user");