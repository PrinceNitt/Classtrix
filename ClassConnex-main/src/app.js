
//console.log("om sai ram");
const express = require('express');
const path=require("path");
const app=express();
const hbs=require("hbs");
const bcrypt = require("bcryptjs"); 
const multer=require('multer');
require('./db/db');


const Register = require("./models/registers");
const Paper=require("./models/papers");
const Note=require("./models/note1");
const Task=require("./models/task");
const Timetable=require("./models/timetable");
const Notice=require("./models/notices");
const Sem=require("./models/semesters");
const Clubevent=require("./models/clubevent");


let port = process.env.PORT || 8000;



const static_path=path.join(__dirname,"../public");
const template_path =path.join(__dirname,"../templates/views");
// const l_path=path.join(__dirname,"../images");
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
// app.set("views",l_path);
app.set("view engine","hbs");
app.set("views",template_path);

var useremail;
app.get("/", (req,res)=>{
    res.render("index");
    // res.send("hello");
}); 



app.get("/register",(req,res)=>{
    res.render("register")    
});

app.post("/register",async(req,res)=>{
   try{
    const password=req.body.password;
    const cpassword= req.body.confirmpassword;
    if(password===cpassword){
        const registeruser = new Register({
            roll:req.body.roll,
            email:req.body.email,
            phone:req.body.phone,
            dept:req.body.dept,
            username:req.body.username,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword,
            cr:0
        })
          
        //password hash


        const registered = await registeruser.save();
        res.status(201).render("index")
    }
    else{
        res.send("password are not matching");
    }
   } catch(error){
    res.status(400).send(error);
   }
});
app.post("/index",async(req,res)=>{
   try{
       const user1 = req.body.username;
       const password = req.body.password;
      
     useremail =  await Register.findOne({username:user1});
       const isMatch =  await bcrypt.compare(password,useremail.password);

       if(isMatch){
        res.status(201).render("home",{useremail});
       }
       else{
        res.send("invalid password login");
       }
   } catch(error) {
    res.status(400).send("Invalid userid");
   }
});


app.get("/paper",(req,res)=>{
    console.log("get method of paper");
    res.render("paper");
});
// app.post("/paper",async(req,res)=>{
//     try{
//         console.log("post method of paper");
//         const dept=req.body.dept;
//         const deptdetails=await Paper.findOne({dept:dept});
//         console.log(deptdetails);
//         res.status(201).render("sem",{deptdetails});
//     }
//     catch(error){
//         res.status(400).send("error")
//     }
// });
app.get("/sem",async(req,res)=>{
    console.log("get method of sem")
    var dept=req.query.dept;
    console.log(dept);
    const deptdetails=await Paper.findOne({dept:dept});
    console.log(deptdetails);
    res.render("sem",{deptdetails});
});
app.get("/notes" ,async(req,res)=>{
    console.log("get method of notes..");
    res.render("notes");
});
// app.post("/notes",async(req,res)=>{
//     try{
//         console.log("hello");
//         const dept=req.body.dept;
//         console.log(dept);
//         const deptdetails=await Note.findOne({dept:dept});
//         console.log(deptdetails);
//         res.status(201).render("semN",{deptdetails});
//     }
//     catch(error){
//         res.status(400).send("error")
//     }
//});
/*fir se home page per vapas ane per admin portal show nhi ho rha tha to useremail ko top per declare kiya per hm use const nhi declar ke skte the 
kyuki initialize kena padh rha tha to var declare kr diya*/
app.get("/home",(req,res)=>{
    console.log(useremail);
    res.render("home",{useremail});
});
app.get("/semN",async(req,res)=>{
    var dept=req.query.dept;
    console.log(dept);
    const deptdetails=await Note.findOne({dept:dept});
    console.log("get method of semN..");
    
    res.render("semN",{deptdetails});
});
app.get("/adminportal",(req,res)=>{
    res.render("adminportal",{useremail});
})
app.get("/assingment",(req,res)=>{
    Task.find({})
    .then((x)=>{
        res.render("assingment",{x,useremail});
        console.log(x);
    })
    .catch((y)=>{
        console.log(y);
    })

});
app.post("/create-task",async(req,res)=>{
    const task=new Task({
        description:req.body.description,
         subject:req.body.subject,
        date:req.body.date
    });

    const tasking= await task.save();
    res.redirect("back");
    
});
app.get("/delete-task",async(req,res)=>{
    console.log("HOII");
    var id=req.query;
    console.log(id);
    var count=Object.keys(id).length;
    for(let i=0;i<count;i++){
        await Task.findByIdAndDelete(Object.keys(id)[i])
    }
    return res.redirect('back');
    })



const Storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname));
    }
});

var upload=multer({
    storage:Storage
}).single('file');
app.get('/upload',function(req,res,next)
{
    Timetable.find({})
    .then((x)=>{
        res.render("timetable",{x,useremail});
        console.log(x);
    })
    .catch((y)=>{
        console.log(y);
    })
    //res.render('timetable',{title:'upload time table',success:''});
});


app.post('/upload', upload,async(req,res,next)=>{
    var imageFile=req.file.filename;
    var success =req.file.filename+"uploaded successfully";
    var imagedetails=new Timetable({
        image:imageFile
    });
    const tabl= await  imagedetails.save();
  res.redirect("back");
})


app.get("/notice",(req,res)=>{
    Notice.find({})
    .then((x)=>{
        res.render("notice",{x,useremail});
        console.log(x);
    })
    .catch((y)=>{
        console.log(y);
    })

});

app.post("/create-notice",async(req,res)=>{
    const notice=new Notice({
        description:req.body.description,
         subject:req.body.subject,
        date:req.body.date
    });

    const announce= await notice.save();
    res.redirect("back");
    
});

app.get("/delete-notice",async(req,res)=>{
    var id=req.query;
    var count=Object.keys(id).length;
    for(let i=0;i<count;i++){
        await Notice.findByIdAndDelete(Object.keys(id)[i])
    }
    return res.redirect('back');
    })

    app.get("/club",(req,res)=>{
        Clubevent.find({})
        .then((x)=>{
            res.render("club",{x,useremail});
            console.log(x);
        })
        .catch((y)=>{
            console.log(y);
        })
    
    });
    
    app.post("/create-clubevent",async(req,res)=>{
        const clubevent=new Clubevent({
            description:req.body.description,
            club:req.body.club,
            date:req.body.date
        });
    
        const announce= await clubevent.save();
        res.redirect("back");
        
    });
    
    app.get("/delete-clubevent",async(req,res)=>{
        var id=req.query;
        var count=Object.keys(id).length;
        for(let i=0;i<count;i++){
            await Clubevent.findByIdAndDelete(Object.keys(id)[i])
        }
        return res.redirect('back');
        })
    
    


    app.get("/addstu",async(req,res)=>{
        const use=useremail;
        const semdetails=await Sem.findOne({sem:use.sem});
        res.render("addstu",{semdetails,useremail});
    })
    app.post("/create-stu",async(req,res)=>{
           const roll=req.body.roll;
           const use=useremail;
          await Sem.findOneAndUpdate({sem:use.sem},{$addToSet:{stu:roll},});
          await Register.findOneAndUpdate({roll:roll},{$set:{sem:use.sem}});
        res.redirect("back");
        
    });
    app.get("/delete-stu",async(req,res)=>{
        const rollnums=req.query;
        console.log(rollnums);
        const use=useremail;
        try {
            if (rollnums && Object.keys(rollnums).length > 0) {
              const rollsToDelete = Object.keys(rollnums); // Get the roll numbers to delete
        
              // Update the database using the $pull operator to remove the specified rolls from the 'stu' array
              await Sem.updateMany({sem:use.sem}, { $pull: { stu: { $in: rollsToDelete } } });
        
              return res.redirect('back');
            } else {
              return res.status(400).send("No roll numbers selected for deletion.");
            }
          } catch (error) {
            console.error(error);
            return res.status(500).send("An error occurred while deleting the roll numbers.");
          }
        });

    app.get("/stuhome",async(req,res)=>{
        res.render("stuhome",{useremail});
    })
    app.get("/stuassing",async(req,res)=>{
        Task.find({})
        .then((x)=>{
            res.render("stuassing", { x: x, useremail: useremail });
            console.log(x);
        })
        .catch((y)=>{
            console.log(y);
        })
    })
    app.get("/stunotice",async(req,res)=>{
        Notice.find({})
        .then((x)=>{
            res.render("stunotice", { x: x, useremail: useremail });
            console.log(x);
        })
        .catch((y)=>{
            console.log(y);
        })
    })
    app.get("/stuclub",async(req,res)=>{
        Clubevent.find({})
        .then((x)=>{
            res.render("stuclub", { x: x, useremail: useremail });
            console.log(x);
        })
        .catch((y)=>{
            console.log(y);
        })
    })
    app.get('/stutimetabl',function(req,res,next)
    {
        Timetable.find({})
        .then((x)=>{
            res.render("stutimetabl", { x: x, useremail: useremail });
            console.log(x);
        })
        .catch((y)=>{
            console.log(y);
        })
        //res.render('timetable',{title:'upload time table',success:''});
    });

//by default this is index page
app.listen(port,()=>{
    console.log(`listen to the ${port}`);
});