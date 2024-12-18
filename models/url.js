const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const UrlSchema = new Schema({
    long_url:{
        type : String,
        required: true
    },
    short_url:{
        type: String,
        require: true
    }
}, { timestamps: true})

const url = mongoose.model('url', UrlSchema);

module.exports = url;
