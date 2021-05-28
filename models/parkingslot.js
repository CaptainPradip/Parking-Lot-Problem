var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var parkingSlot = new Schema({
  isOccupied: { type: String, required: false, default: false },
  bookingTime: { type: Date, required: false, default: '' },
  arrivalTime: { type: Date, required: false, default: '' },
  userEmail: { type: String, required: false, default: '' },
  category: { type: String, required: false, default: 'General' },
});

module.exports = mongoose.model('ParkingSlots', parkingSlot);