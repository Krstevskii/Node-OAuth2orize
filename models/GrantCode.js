const mongoose = require('mongoose');
const uid = require('uid-safe');

const Schema = mongoose.Schema;
const GrantCodeSchema = new Schema({
    code: {
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

    scope: [{type: String}],
    active: {
        type: Boolean, default: true
    }
});

module.exports = GrantCode = mongoose.model('GrantCode', GrantCodeSchema);
