const mongoose = require('mongoose');
const timetableschema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    }
    
});

const Timetable = mongoose.model('Time', timetableschema);

// exporting the Schema
module.exports = Timetable;
