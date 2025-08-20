const mongoose=require("mongoose");
const noteschema=new mongoose.Schema({
    dept:{
        type:String,
        required:true
    },
    sem1:{
        type:String
    },
    sem2:{
        type:String
    },
    sem3:{
        type:String
    }
})

const notes= new mongoose.model("Stunote",noteschema);
module.exports=notes;

