const express = require('express');
const Application = require('../models/Application');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('clients/register', {
        title: 'Clients | Register'
    });
});

router.post('/', (req, res) => {
    const newClient = {
        title: req.body.title,
        domains: [req.body.domains]
    };

    new Application(newClient)
        .save()
        .then(app => res.json({msg: 'A new App has registered', app}), err => res.json(err))
        .catch(err => res.json(err));
});

module.exports = router;
