const mongoose = require('mongoose');
const uid = require('uid-safe');

const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({

    title: {
        type: String, required: true
    },

    oauth_id: {
        type: String, unique: true, default: () => {
            return uid.sync(256);
        },
    },

    oauth_secret: {
        type: String, unique: true, default: () => {
            return uid.sync(256);
        }
    },

    domains: [{
        type: String
    }]

})

module.exports = Application = mongoose.model('Application', ApplicationSchema);
