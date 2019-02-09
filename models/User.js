const mongoose = require("mongoose"),
      jwt      = require("jsonwebtoken"),
      bcrypt   = require("bcrypt");

const userSchema = mongoose.Schema({
    username:      String,
    password:      String,
    email:         String,
    avatar:        String
});

userSchema.methods.generateToken = function generateToken() {
    return jwt.sign({
        email:this.email,
        userAvatar: this.avatar        
    },process.env.JWT_SECRET_KEY
    );
};

userSchema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateHashedPass = function generateHashedPass(password) {
   return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.toAuthJSON = function toAuthJSON() {
  return {
      email: this.email,
      userAvatar: this.avatar
  };
};
module.exports = mongoose.model('User', userSchema);