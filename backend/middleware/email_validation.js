const validator = require('validator')


module.exports = (req, res, next) => {
    if (validator.isEmail(req.body.email) === true) {
        next();
    } else {
        alert(`l'email n'est pas au bon format`)
    }
}