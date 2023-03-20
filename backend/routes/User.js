const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user')
const limiter = require('../middleware/limiter')
const emailValidation = require('../middleware/email_validation')
const passwordValidation = require('../middleware/password_validation')

router.post('/signup', emailValidation, passwordValidation, userCtrl.signup);
router.post('/login', limiter, userCtrl.login)

module.exports = router;