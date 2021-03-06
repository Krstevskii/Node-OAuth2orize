const oauth2orize = require('oauth2orize');
const GrantCode = require('../models/GrantCode');
const AccessToken = require('../models/AccessToken');
const Application = require('../models/Application');
const User = require('../models/User');

const server = oauth2orize.createServer();

server.grant(oauth2orize.grant.code({
    scopeSeparator: [' ', ',']
}, (application, redirectURI, user, ares, done) => {

    console.log(application);
    console.log(redirectURI);
    console.log(user);
    console.log(ares.scope);
    const grant = new GrantCode({
        application: application,
        user: user,
        scope: ares.scope
    });

    grant.save()
        .then(grnt => done(null, grnt.code), err => done(err))
        .catch(err => done(err));

}));

server.exchange(oauth2orize.exchange.code({
    userProperty: 'app'
}, (application, code, redirectURI, done) => {
    console.log(application);
    GrantCode.findOne({code: code})
        .then(grant => {
            if (grant && grant.active && grant.application == application.id) {
                const token = new AccessToken({
                    application: grant.application,
                    user: grant.user,
                    grant: grant,
                    scope: grant.scope
                });

                token.save()
                    .then(tkn => done(null, tkn.token), err => done(err))
                    .catch(err => done(err));
            }
        })

}));

server.serializeClient((application, done) => done(null, application.id));
server.deserializeClient((id, done) => {
    Application.findById(id)
        .then(app => done(null, app), err => done(err))
        .catch(err => done(err));
});
module.exports = server;
