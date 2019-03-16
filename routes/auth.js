const express = require('express');
const url = require('url');
const Application = require('../models/Application');
const passport = require('passport');
const server = require('../config/oauth2orize');

const router = express.Router();

router.get('/start', server.authorize((applicationID, redirectURI, done) => {
    Application.findOne({oauth_id: applicationID})
        .then(application => {
            if (application) {
                let match = false;
                const uri = url.parse(redirectURI || '');
                for (let i = 0; i < application.domains.length; i++) {
                    if (uri.host === application.domains[i] || uri.protocol !== 'http:' || uri.protocol !== 'https:') {
                        match = true;
                        break;
                    }
                }
                if (match && redirectURI && redirectURI.length > 0) {
                    done(null, application, redirectURI);
                } else {
                    done(new Error('You must supply a redirect_rui that is a domain or url scheme owned by your app'), false);
                }
            } else done(new Error('There is no app with the client_id you supplied'), false);
        }, err => done(err));
}), (req, res) => {
    const scope = {
        account: 'view account'
    };
    console.log('User:' + req.user);
    res.render('oauth/oauth', {
        transaction_id: req.oauth2.transactionID,
        currentURL: req.originalUrl,
        response_type: req.query.response_type,
        scope: req.oauth2.req.scope,
        application: req.oauth2.client,
        user: req.user,
        map: scope
    })

});

router.post('/finish', (req, res, next) => {
        if (req.user) {
            next();
        } else {
            passport.authenticate('local', {}, (err, user, info) => {
                if (user) {
                    next();
                } else if (!err) {
                    res.redirect(req.body.auth_url);
                }
            })(req, res, next);
            // res.render('home');
        }

    }, server.decision((req, done) => {
        done(null, {scope: req.oauth2.req.scope});
    })
);

router.post('/exchange', (req, res, next) => {

    const appID = req.body.client_id;
    const appSecret = req.body.client_secret;

    Application.findOne({
        oauth_id: appID, oauth_secret: appSecret
    })
        .then(app => {
            if (!app) {
                next(new Error('There was no application with the ApllicationID and Application Secret'));
            } else {
                req.app = app;
                next()
            }

        }, err => next(err))

}, server.token(), server.errorHandler());

module.exports = router;
