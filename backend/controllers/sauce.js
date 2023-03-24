const ModelSauce = require('../models/Sauce')
const fs = require('fs')


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new ModelSauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => {
            res.status(201).json({message: 'Sauce enregistré !'})
        })
        .catch(error => {
            res.status(400).json({error})
        })
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    delete sauceObject.userId;
    ModelSauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else if (req.file) {
                const oldPath = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${oldPath}`, (error) => {
                    if (error) {
                        return error
                    }
                })
                ModelSauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce modifié!'}))
                    .catch(error => res.status(401).json({error}));
            } else {
                ModelSauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce modifié!'}))
                    .catch(error => res.status(401).json({error}));
            }
        })
        .catch((error) => {
            res.status(400).json({error});
        });
};

exports.deleteSauce = (req, res, next) => {
    ModelSauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    ModelSauce.deleteOne({_id: req.params.id})
                        .then(() => {
                            res.status(200).json({message: 'Sauce supprimé !'})
                        })
                        .catch(error => res.status(401).json({error}));
                });
            }
        })
        .catch(error => {
            res.status(500).json({error});
        });
};

exports.likeSauce = (req, res, next) => {
    ModelSauce.findOne({_id: req.params.id})
        .then(sauce => {
            switch (req.body.like) {
                case 1 :
                    if (!sauce.usersLiked.includes(req.body.userId)) {
                        ModelSauce.updateOne({_id: req.params.id}, {
                            $inc: {likes: 1}, $push: {usersLiked: req.body.userId}
                        })
                            .then(() => res.status(201).json({message: 'like ajouté'}))
                            .catch(error => res.status(400).json(error))
                    } else {
                        return res.status(400).json({error: `vous ne pouvez liker q'une fois chaque sauce`})
                    }
                    break;
                case -1 :
                    if (!sauce.usersDisliked.includes(req.body.userId)) {
                        ModelSauce.updateOne({_id: req.params.id}, {
                            $inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}
                        })
                            .then(() => res.status(201).json({message: 'dislike ajouté'}))
                            .catch(error => res.status(400).json(error))
                    } else {
                        return res.status(401).json({error: "Vous ne pouvez disliker qu'une seule fois chaque sauce !"})
                    }
                    break;

                case 0 :
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        ModelSauce.updateOne({_id: req.params.id}, {
                            $inc: {likes: -1}, $pull: {usersLiked: req.body.userId}
                        })
                            .then(() => res.status(200).json({message: 'like retiré'}))
                            .catch(error => res.status(400).json(error))
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        ModelSauce.updateOne({_id: req.params.id}, {
                            $inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}
                        })
                            .then(() => res.status(200).json({message: 'dislike retiré'}))
                            .catch(error => res.status(400).json(error))
                    } else {
                        return res.status(401).json({error: "Vous n'avez jamais liké ni disliké !"})
                    }
            }
        })
        .catch(error => res.status(404).json(error))
}

exports.getOne = (req, res, next) => {
    ModelSauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}))
}

exports.getAll = (req, res, next) => {
    ModelSauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}))
}