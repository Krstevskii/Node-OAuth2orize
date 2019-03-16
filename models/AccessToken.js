const mongoose = require('mongoose');
const uid = require('uid-safe');

const Schema = mongoose.Schema;

const AccessTokenSchema = new Schema({

    token: {
        type: String, unique: true, default: () => {
            return uid.sync(256);
        }
    },

    user: {
        type: Schema.Types.ObjectId, ref: 'User'
    },

    application: {
        type: Schema.Types.ObjectId, ref: 'Application'
    },

    grant: {
        type: Schema.Types.ObjectId, ref: 'GrantCode'
    },

    scope: [{type: String}],

    expires: {
        type: Date, default: function () {
            const today = new Date();
            const length = 60;

            return new Date(today.getTime() + length * 60000);
        }
    },

    active: {
        type: Boolean, get: function (value) {
            if (expires < new Date() || !value) {
                return false;
            } else {
                return value;
            }
        }, default: true
    }

});

module.exports = AccessToken = mongoose.model('AccessToken', AccessTokenSchema);
