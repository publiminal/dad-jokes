const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('./auth-model')
const { checkUsernameExists, checkPayload } = require('./auth-middleware');
// const { findBy } = require('../users/users-model')
const { JWT_SECRET , BCRYPT_ROUNDS } = require("../secrets"); // use this secret!

function generateToken(user) {
  const payload = {
    subject:user.id, 
    username:user.username,
    password:user.password,
  }
  const options = { expiresIn: '1d' };
  return jwt.sign(payload, JWT_SECRET, options);
}


router.post('/register', checkPayload, checkUsernameExists, (req, res, next) => {
  // res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

      const user = req.user
      // bcrypting the password before saving
      const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS)
      // never save the plain text password in the db
      user.password = hash
      // console.log('registering  user', user)
      db.add(user)
        .then(newUser => { res.status(201).json(newUser) })
        .catch(next) // our custom err handling middleware in server.js will trap this
});

router.post('/login', checkPayload, async (req, res, next) => {
  // res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

      try {
        const {password} = req.body 
        // req.user exists after success  middleware validation
        const [user] = await db.findBy({username:req.user.username}) 
        // console.log('username for login', user)
        //if user exists tries find password otherwise return 
        if (user && bcrypt.compareSync(password, user.password)) { //user and pass are validated
          //  console.log('user', user)
           const token = generateToken(user)  //this is JWT
            res.status(200).json( { message: `welcome, ${user.username}`,token } );
        }else{
            next({status:401, message:'invalid credentials'})
        }
  
    } catch (err) { next(err) }
});

module.exports = router;
