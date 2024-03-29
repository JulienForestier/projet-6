const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const sauceRoutes = require('./routes/Sauce');
const userRoutes = require('./routes/User')
const helmet = require("helmet");

//connexion a mongoDB
mongoose.connect(process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());
app.use('/api/sauces', sauceRoutes );
app.use('/api/auth', userRoutes );

module.exports = app;