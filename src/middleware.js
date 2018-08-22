import {getSecret} from './utils'
const jwt = require('jsonwebtoken');

export const authenticate = (req, res, next) => {
  let token = req.headers['authorization'];

  if (token) {
    try {
      // Verify token validity
      jwt.verify(token, getSecret(), (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({success: false, message: 'Failed to authenticate token.'});
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    return res
      .status(403)
      .json({success: false, message: 'No token provided.'});
  }
};
