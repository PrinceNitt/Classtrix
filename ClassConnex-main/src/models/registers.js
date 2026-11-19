const mongoose=require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema= new mongoose.Schema({
    roll:{
        type:Number,
        required:true,
        unique:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true 
    },
    dept:{
        type:String,
        required:true,
        trim:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
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
       type: Boolean,
       default: false
    },
    sem:{
       type:String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
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