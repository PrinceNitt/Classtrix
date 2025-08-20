const mongoose=require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema= new mongoose.Schema({
    roll:{
        type:Number,
        reqiured:true,
        unique:true

    },
    email:{
        type:String,
        required:true,
        unique:true 
    },
    phone:{
        type:Number,
        required:true,
        unique:true 
    },
    dept:{
        type:String,
        reqiured:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true  
    },
    confirmpassword: {
     type:String,
     required:true
    },
    cr:{
       type: Boolean
    },
    sem:{
       type:String
    }
})

userSchema.pre("save",async function(next){
    if(this.isModified("password"))
    {
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = undefined;
    }
    next();
})
const Register = new mongoose.model("Student",userSchema);
module.exports = Register;   