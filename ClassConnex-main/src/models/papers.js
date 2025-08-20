const mongoose=require("mongoose");
const paperschema=new mongoose.Schema({
    dept:{
        type:String,
        required:true,
        unique:true
    },
    sem1:{
        type:String,
        //required:true
    },
    sem2:{
        type:String,
        //required:true
    },
    sem3:{
        type:String,
        //reqiured:true
    }
})

const Paper=new mongoose.model("Question",paperschema);
module.exports=Paper;