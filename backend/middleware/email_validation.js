const validator = require('validator')
const {json} = require("express");


module.exports = (req, res, next) => {
    if (validator.isEmail(req.body.email) === true) {
        next();
    } else {
        res.status(400).json({message: `l'email' n'est pas valide`})
    }
}