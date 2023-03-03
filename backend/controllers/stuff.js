const thing = require('../models/thing')


exports.createThing = (req, res, next) => {
    delete req.body._id;
    const thing = new thing({
        ...req.body
    });
    thing.save()
        .then(() => res.status(201).json({message : "enregistré"}))
        .catch((error) => res.status(400).json({error}))
}

exports.modifyThing = (req,res,next) => {
    thing.updateOne({_id : req.params.id}, {...req.body, _id: req.params.id})
        .then(() => res.status(200).json({message: "objet modifié"}))
        .catch(error => res.status(400).json({error}))
}

exports.deleteThing = (req,res,next) => {
    thing.deleteOne({_id : req.params.id})
        .then(() => res.status(200).json({message : 'objet supprimer'}))
        .catch(error => res.status(400).json({error}))
}

exports.getOne = (req,res,next) => {
    thing.findOne({_id : req.params.id})
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({error}))
}

exports.getAll = (req,res,next) => {
    thing.find()
        .then(thing => res.status(200).json({thing}))
        .catch(error => res.status(400).json({error}))
}