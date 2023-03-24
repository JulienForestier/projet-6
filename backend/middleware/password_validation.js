const passwordValidation = require('password-validator');
const {json} = require("express");

const schema = new passwordValidation()

schema.is().min(8);
schema.is().max(20);
schema.has().uppercase();
schema.has().digits(1);
schema.has().not().spaces()

module.exports = (req, res, next) => {
    if (schema.validate(req.body.password) === true) {
        next()
    } else {
        res.status(400).json({message: `le mot de passe n'est pas valide`})
    }
}