const jwt = require('jsonwebtoken');
const config = require('config');
exports.authUser = (req, res, next) => {
  if (req.headers['authorization']) {
    try {
      let authorization = req.headers['authorization'].split(' ');
      if (authorization[0] !== 'Bearer') {
        res.status(401).send('invalid request'); //invalid request
      } else {
        req.jwt = jwt.verify(authorization[1], config.secret);
        next();
      }
    } catch (err) {
      res.status(403).send({
        'message': 'User, Token expired!'
      }); //invalid token
    }
  } else {
    res.status(401).send({
      "message": 'Invalid request, token header is missing!'
    });
  }
}