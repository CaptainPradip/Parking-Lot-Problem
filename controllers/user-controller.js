const jwt = require('jsonwebtoken');
const User = require('../models/users');
const config = require('config');
// Parking Lot Create | Update
exports.createUser = (req, res,) => {
  var user = new User();
  user.email = req.body.email;
  user.password = req.body.password;
  user.type = req.body.type ? req.body.type : 'General';
  if (req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '') {
    res.json({ success: false, message: "Ensure User Name ,Password ,Email is provided !!!" });
  }
  else {
    user.save(function (error) {
      if (error) {
        res.json({ success: false, message: "Email Already Existed !!!" });
      }
      else {
        res.json({
          success: true,
          message: "User is Created !!!"
        });
      }
    })
  }
}
exports.loginUser = (req, res,) => {
  if (req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {

    res.json({ success: false, message: "Email ,Password is not provided !!!" });
  }
  else {
    User.findOne({ email: req.body.email }).select('_id email password role').exec(function (error, user) {

      if (error) {
        throw error
      }
      if (!user) {
        res.json({
          success: false,
          message: "Could not authenticate User !!"
        });
      }
      else if (user) {
        console.log(user.email)
        user.comparePassword(req.body.password, function (error, isMatch) {
          console.log(isMatch + "++++++++++++++++++++++++++++")
          if (error) {
            throw error;
          }
          if (isMatch) {
            console.log("Authenticate user" + user.role)
            console.log(user);
            const payload =
            {
              _id: user._id,
              email: user.email,
              role: user.role,
              type: user.type
            }
            var token = jwt.sign(payload, config.secret, { expiresIn: '24h' });

            res.json({
              success: true,
              message: "authenticate User !!",
              user: user,
              token: token
            });

          }
          else {
            res.json({
              success: false,
              message: "Could not authenticate Password !!"
            });
          }
        })
      }
    })
  }
}
exports.getAllUsers = (req, res) => {
  User.find().select('_id email parkingNumber role')
    .exec((error, users) => {
      if (error) {
        res.status(500).json({
          success: false,
          error: "There was a problem finding the information to the database."
        })
      } else {
        res.status(200).json({
          success: true,
          users: users
        })
      }
    });
}

