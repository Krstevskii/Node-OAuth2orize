const mongoose = require('mongoose');
const uid = require('uid-safe');

const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({

    title: {
        type: String, required: true
    },

    oauth_id: {
        type: Number, unique: true
    },

    oauth_secret: {
        type: String, unique: true, default: async function() {
            return await uid(256);
        }
    },

    userId: {
        type: Schema.Types.ObjectId, ref: 'User'
    }

})
