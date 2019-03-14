const oauth2orize = require('oauth2orize');
const GrantCode = require('../models/GrantCode');
const AccessToken = require('../models/AccessToken');
const Application = require('../models/Application');
const User = require('../models/User');

const server = oauth2orize.createServer();

server.grant(oauth2orize.grant.code({
    scopeSeparator: [' ', ',']
}, (application, redirectURI, user, ares, done) => {
    const grant = new GrantCode({
        application: application,
        user: user,
        scope: ares.scope
    });

    grant.save()
        .then(grnt => done(null, grnt.code), err => done(err))
        .catch(err => done(err));
}));
