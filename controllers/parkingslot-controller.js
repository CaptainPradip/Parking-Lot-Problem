const jwt = require('jsonwebtoken');
const User = require('../models/users');
const ParkingSlot = require('../models/parkingslot');
const config = require('config');
// Parking Lot Create | Update
exports.addParkingSlot = (req, res,) => {
  if (req.body.newParkingCount == null || req.body.newParkingCount == '' || isNaN(req.body.newParkingCount)) {
    res.json({ success: false, message: "Ensure That Enter Valid Number!!!" });
  }
  else {
    const parkingSlotsSpecial = new Array(parseInt(req.body.newParkingCount * (20 / 100))).fill({
      isOccupied: false,
      bookingTime: '',
      arrivalTime: '',
      category: 'Special'
    })
    const parkingSlotsGeneral = new Array(parseInt(req.body.newParkingCount * (80 / 100))).fill({
      isOccupied: false,
      bookingTime: '',
      arrivalTime: '',
      category: 'General'
    })
    ParkingSlot.insertMany([...parkingSlotsSpecial, ...parkingSlotsGeneral], function (error) {
      if (error) {
        console.log(error)
        res.json({ success: false, message: "error when adding Parking Slot" });
      }
      else {
        res.json({
          success: true,
          message: "Parking Slot added is Created !!!"
        });
      }
    })
  }
}
exports.bookParking = async (req, res,) => {
  const booking = await ParkingSlot.find({ userEmail: req.jwt.email });
  let isOccupiedParking = isFiftyPercentOccupiedParking();
  if (!booking.length) {
    let specialParkingCount = await ParkingSlot.count({ isOccupied: false, category: 'Special' });
    ParkingSlot.findOneAndUpdate(
      {
        isOccupied: false, category: req.jwt.type == 'Special' && specialParkingCount ? "Special" : 'General'
      }, { isOccupied: true, bookingTime: Date.now(), userEmail: req.jwt.email }, function (error, parkingSlot) {
        if (error) {
          console.log(error);
          res.json({ success: false, message: "error when adding Parking Slot" });
        }
        else {
          if (parkingSlot) {
            setTimeout(async () => {
              await ParkingSlot.findOneAndUpdate({ userEmail: req.jwt.email , arrivalTime: '' }, { isOccupied: false, bookingTime: '', userEmail: '' });
            }, isOccupiedParking ? 15 * 60 * 1000 : 30 * 60 * 1000);
            res.json({
              success: true,
              message: "Parking is Reserve Booking ID: " + parkingSlot._id + " for Next" + (isOccupiedParking ? ' 15 min' : '30 min')
            });
          } else {
            res.json({
              success: true,
              message: "Parking is Not available"
            });
          }
        }
      })

  } else {
    res.json({
      success: true,
      message: "Parking is Reserve Booking ID: " + booking[0]._id
    });
  }
}
exports.addParking = (req, res,) => {
  ParkingSlot.findOneAndUpdate({ userEmail: req.jwt.email, arrivalTime: '' }, { arrivalTime: Date.now() }, function (error, parkingSlot) {
    if (error) {
      console.log(error)
      res.json({ success: false, message: "error when adding Parking Slot" });
    }
    else {
      if (parkingSlot) {
        res.json({
          success: true,
          message: "Parking is Reserve Booking ID: " + parkingSlot._id
        });
      } else {
        res.json({
          success: true,
          message: "Parking is Not Reserve"
        });
      }
    }
  })
}
exports.ExitParking = (req, res,) => {
  ParkingSlot.findOneAndUpdate({ userEmail: req.jwt.email }, {
    isOccupied: false,
    bookingTime: '',
    arrivalTime: '',
    userEmail: '',
  }, function (error, parkingSlot) {
    if (error) {
      console.log(error)
      res.json({ success: false, message: "error when Exiting Parking Slot" });
    }
    else {
      console.log(parkingSlot);
      if (parkingSlot) {
        res.json({
          success: true,
          message: "Successfully exit !!!"
        });
      } else {
        res.json({
          success: true,
          message: "Parking is Not Reserve"
        });
      }
    }
  })
}
exports.getAllAvailableParking = (req, res) => {
  ParkingSlot.find({ isOccupied: false }).select('_id  category')
    .exec((error, count) => {
      if (error) {
        res.status(500).json({
          success: false,
          error: "There was a problem finding the information to the database."
        })
      } else {
        res.status(200).json({
          success: true,
          availableParkingSlots: count
        })
      }
    });
}
exports.getAllOccupiedParking = (req, res) => {
  ParkingSlot.find({ isOccupied: true }).select('_id isOccupied bookingTime arrivalTime userEmail category')
    .exec((error, count) => {
      if (error) {
        res.status(500).json({
          success: false,
          error: "There was a problem finding the information to the database."
        })
      } else {
        res.status(200).json({
          success: true,
          occupiedParkingSlots: count
        })
      }
    });
}

async function isFiftyPercentOccupiedParking() {
  const totalParkingSlotCount = await ParkingSlot.count();
  const occupiedCount = await ParkingSlot.count({ isOccupied: true });
  const occupiesPercent = ((occupiedCount / totalParkingSlotCount) * 100).toFixed();
  return occupiesPercent > 50;
}
