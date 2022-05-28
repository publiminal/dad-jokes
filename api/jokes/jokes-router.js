// do not make changes to this file
const router = require('express').Router();
const { restricted } = require('../auth/auth-middleware')
const jokes = require('./jokes-data');

router.get('/', restricted,  (req, res) => {
  res.status(200).json(jokes);
});

module.exports = router;
