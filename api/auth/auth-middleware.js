const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../secrets"); // use this secret!
const db = require('../auth/auth-model')

const restricted = async (req, res, next) => {
  // the server expect to find the token in authorization header.
  /*
    If the user does not provide a token in the Authorization header:
    status 401
    {
      "message": "Token required"
    }

    If the provided token does not verify:
    status 401
    {
      "message": "Token invalid"
    }

    Put the decoded token in the req object, to make life easier for middlewares downstream!
  */

    const token = req.headers.authorization
    if(token == null) {
      next({ status: 401, message: 'Token required' });
      return;
    }
  
    try {
      const validateToken = jwt.verify(token, JWT_SECRET);
      req.decodedJwt = validateToken
    //   let user = await db.findById(req.decodedJwt.subject);

    } catch(err) {
      console.log('login err >>> ', err.message)
      next({ status: 401, message: 'Token invalid' });
      return;
    }

    next()
/*     console.log('restricting access to authed users only !!!')
    if(req.session.user){
        next()
    }else{
        next({status:401, message:'bad credentials'})
    } */
}


const checkUsernameExists = async (req, res, next) => {
  /*
    If the username in req.body does NOT exist in the database
    status 401
    {
      "message": "Invalid credentials"
    }
  */
 
    //const {username} = req.body
    // get username from req.user.username which was added by checkPayload() if validation succeded.
    const [username] = await db.findBy({username:req.user.username})
    // console.log('usernameExists', usernameExists)
    if(username != null){ res.status(401).json( {message:"username taken"} ); return; }

    next()
}

const checkPayload = (req, res, next) => {
 
    const user = req.body
    const isValid =  'username' in user && 'password' in user
    if(!isValid){ res.status(400).json({ message: "username and password required" }); return; }
   
     const name = user.username != null ? user.username.trim() : ''
     const hasinvalidName = name.length < 3 || name.length > 128
     const isOk = !hasinvalidName
     
     if(hasinvalidName){ res.status(400).json({ message: "name must be between 3 and 127"}); return; }
     if(isOk){ req.user = { ...user,  username:name}; next() }
   
   }

module.exports = {
  restricted,
  checkUsernameExists,
  checkPayload
}
