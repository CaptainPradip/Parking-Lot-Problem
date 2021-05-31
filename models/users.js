var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  type: { type: String, default: 'General' },
  createdDate: { type: Date, formate: 'dd mmmmm yyyy', default: Date.now },
  updatedDate: { type: Date, formate: 'dd mmmmm yyyy', default: Date.now },
});

// methods ======================
// generating a hash

userSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, null, null, function (error, hash) {
    if (error) {
      return next(error)
    }
    user.password = hash;
    next();
  });
});
userSchema.pre('findByIdAndUpdate', function (next) {
  var user = this;
  bcrypt.hash(password, null, null, function (error, hash) {
    if (error) {
      return next(error)
    }
    password = hash;
    next();
  });
});
// checking if password is valid
userSchema.methods.comparePassword = function (password, validation) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) validation(err);
    validation(null, isMatch);
  });
}
module.exports = mongoose.model('Users', userSchema);