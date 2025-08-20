const mongoose = require('mongoose');

// creating Schema for Tasks
const noticeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});


const Notice= mongoose.model('Notice', noticeSchema);

// exporting the Schema
module.exports = Notice;