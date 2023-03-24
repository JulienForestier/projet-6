const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const secretToken = process.env.SECRET_TOKEN;
const saltRounds = parseInt(process.env.SALT);

// utilisation de bcrypt pour hacher et saler le mdp
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (!err) {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save(function (err) {
                if (!err) {
                    return res.status(201).json({message: 'Utilisateur créé !'})
                } else {
                    return res.status(400).json(err)
                }
            })
        } else throw err;

    })
};

// création d'un token avec userId
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({error: 'email ou mot de passe incorect!'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: 'email ou mot de passe incorect!'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            secretToken,
                            {expiresIn: '6h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};