const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('users/register');
});

// @route   POST /api/users
// @desc    Add User
// @access  Public
router.post('/', (req, res) => {
    const newUser = {
        username: req.body.username,
        password: req.body.password
    };

    new User(newUser)
        .save()
        .then(usr => res.json({msg: 'A new user has been added', usr}), err => res.json(err))
        .catch(err => res.json(err));
});

// @access Private
router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users), err => res.json(err))
        .catch(err => res.json(err));
});

module.exports = router;
