const express = require('express');
const cors = require('cors');
const mongoose = require('./db/db');
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const apiRoutes = require('./routes/routes');
var port = process.env.PORT || 3000;
app.use('', apiRoutes);

//Capture All 404 errors
app.use(function (req, res, next) {
  res.status(404).send('Error - Unable to find the requested resource!');
});
app.use((req, res, next) => {

  const error = new Error('Not found')
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {

  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

app.listen(port, () => {
  console.log(`Server started on :` + port);
});


module.exports = app;