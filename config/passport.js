const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        _usernameField: 'username',
        _passwordField: 'password'
    }, (username, password, done) => {
        User.findOne({username: username})
            .then(user => {
                if (!user)
                    return done(null, false);

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (!isMatch)
                        return done(null, false);

                    done(null, user);
                });
            })
            .catch(err => done(err));
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        User.findById({id})
            .then(usr => {
                if (!usr)
                    done(null, false);
                done(null, usr)
            }, err => done(err));
    })
};
