const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config({ path: "./.env" });
//inplace of localhost put 0.0.0.0
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true
    //useCreateIndex:true
})
.then(()=>{
    console.log('connect');
})
.catch((error)=>{
    console.log(error);
})