import express from 'express'

const router = express.Router();
import User from '../models/user'

import AES from 'crypto-js/aes'
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//REGISTER


module.exports = router;
