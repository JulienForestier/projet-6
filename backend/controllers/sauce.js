const ModelSauce = require('../models/Sauce')
const fs = require('fs')


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.thing);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new ModelSauce ({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
        .catch(error => { res.status(400).json( { error })})
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject.userId;
    ModelSauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                ModelSauce.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Sauce modifié!'}))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    ModelSauce.findOne({ _id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    ModelSauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

exports.getOne = (req,res,next) => {
    ModelSauce.findOne({_id : req.params.id})
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({error}))
}

exports.getAll = (req,res,next) => {
    ModelSauce.find()
        .then(thing => res.status(200).json({thing}))
        .catch(error => res.status(400).json({error}))
}