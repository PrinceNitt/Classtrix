const mongoose = require('mongoose');

// creating Schema for Tasks
const clubeventSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    club: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});


const Clubevent= mongoose.model('Clubevent', clubeventSchema);

// exporting the Schema
module.exports = Clubevent;