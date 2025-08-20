const mongoose = require('mongoose');

// creating Schema for Tasks
const semSchema= new mongoose.Schema({
    sem:{
        type: String,
        required: true,
        unique:true
    },
   cr:{
    type:Number,
    required:true,
    unique:true
   },
   stu:{
    type:[Number],
    required:true
   }
});


const Sem = mongoose.model('semester', semSchema);

// exporting the Schema
module.exports = Sem;