

((jwtTokenGeneratorHelper) => {
    'use strict';
  
    const jwt = require('jsonwebtoken');

    const dotenv = require("dotenv");
     dotenv.config();
  
    jwtTokenGeneratorHelper.generateJWTToken = (userId, expiryTime) => {
      const token = jwt.sign(
        {
          user: userId,      },
          "testotkensert",
        {
          algorithm: "HS512",
          expiresIn: "72h", // expires in given hours
        }
      );
      return {
        success: true,
        token: token,
        userInfo: userId,
      };
    };



  
    jwtTokenGeneratorHelper.verifyJWTToken = (token) => {
      try {
        return new Promise((resolve, reject) => {
          jwt.verify(token, process.env.TOKEN_SECRET, { algorithm: process.env.AUTH_HASH_ALGORITHM }, (err, decoded) => {
            if (err) {
              return resolve({ success: false, message: err.name });
            }
            return resolve({ success: true, data: decoded });
          });
        });
      } catch (err) {
        throw err;
      }
    };
  
  
    jwtTokenGeneratorHelper.generateJwtAuthToken = (signObject, expiryTime) => {
      const token = jwt.sign(
        signObject,
        process.env.TOKEN_SECRET,
        {
          algorithm: process.env.AUTH_HASH_ALGORITHM,
          expiresIn: expiryTime || process.env.AUTH_TOKEN_EXPIRES, // expires in given hours
        }
      );
      return {
        success: true,
        token: token
      };
    };
  
  })(module.exports);
  