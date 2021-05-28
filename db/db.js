const mongoose = require('mongoose');
const config = require('config');


// Mongodb LocalUrl
const connectUrl = config.localMongodb.url + '' + config.localMongodb.serverUrl + ':' + config.localMongodb.port + '/' + config.localMongodb.databaseName;

mongoose.connect(connectUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (!err) {
    console.log('MongoDB connected...');
  } else {
    console.log('Error in DB connection: ' + JSON.stringify(err, undefined, 2));
  }
})

module.exports = mongoose