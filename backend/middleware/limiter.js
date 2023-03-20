const rateLimit = require('express-rate-limit')

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: true
})
