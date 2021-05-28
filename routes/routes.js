const express = require('express');
const app = express();
// Authentication of user
const authentication = require('../authentication/auth');

const userController = require('../controllers/user-controller')
const parkingController = require('../controllers/parkingslot-controller')

app.get('/', (req, res) => {
  res.send({
    status: 200,
    message: 'App is working fine!'
  });
});


app.post('/signup', (req, res) => {
  userController.createUser(req, res);
});
app.post('/login', (req, res) => {
  userController.loginUser(req, res);
});
app.get('/getAllUsers', authentication.authUser, (req, res) => {
  userController.getAllUsers(req, res);
});
app.post('/addParkingSlot', authentication.authUser, (req, res) => {
  parkingController.addParkingSlot(req, res);
});
app.post('/book', authentication.authUser, (req, res) => {
  parkingController.bookParking(req, res);
});
app.post('/park', authentication.authUser, (req, res) => {
  parkingController.addParking(req, res);
});
app.post('/exit', authentication.authUser, (req, res) => {
  parkingController.ExitParking(req, res);
});

app.get('/getAvailableParking', authentication.authUser, (req, res) => {
  parkingController.getAllAvailableParking(req, res);
});
app.get('/getOccupiedParking', authentication.authUser, (req, res) => {
  parkingController.getAllOccupiedParking(req, res);
});
module.exports = app;