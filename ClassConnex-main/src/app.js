
//console.log("om sai ram");
const express = require('express');
const path=require("path");
const app=express();
const hbs=require("hbs");
const bcrypt = require("bcryptjs"); 
const multer=require('multer');
const session = require("express-session");
const rateLimit = require("express-rate-limit");
require('./db/db');


const Register = require("./models/registers");
const Paper=require("./models/papers");
const Note=require("./models/note1");
const Task=require("./models/task");
const Timetable=require("./models/timetable");
const Notice=require("./models/notices");
const Sem=require("./models/semesters");
const Clubevent=require("./models/clubevent");

const ADMIN_EMAIL = "prince774623kumar@gmail.com";
const getUser = (req) => req?.session?.user || null;

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

let port = process.env.PORT || 3000;



const static_path=path.join(__dirname,"../public");
const template_path =path.join(__dirname,"../templates/views");
// const l_path=path.join(__dirname,"../images");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax"
    }
}));

app.use((req,res,next)=>{
    res.locals.useremail = getUser(req);
    next();
});

app.use(express.static(static_path));
// app.set("views",l_path);
app.set("view engine","hbs");
app.set("views",template_path);
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
       const user1 = (req.body.username || "").trim();
       const password = (req.body.password || "").trim();
       if(!user1 || !password){
        return res.status(400).send("Username and password required");
       }
     const userRecord =  await Register.findOne({username:user1});
       if(!userRecord){
        return res.status(400).send("Invalid userid");
       }
       const isMatch =  await bcrypt.compare(password,userRecord.password);

       if(isMatch){
        req.session.user = {
            _id: userRecord._id,
            username: userRecord.username,
            email: userRecord.email,
            cr: userRecord.cr,
            sem: userRecord.sem
        };
        res.status(201).render("home",{useremail:req.session.user});
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
    const user = getUser(req);
    res.render("home",{useremail:user});
});
app.get("/semN",async(req,res)=>{
    var dept=req.query.dept;
    console.log(dept);
    const deptdetails=await Note.findOne({dept:dept});
    console.log("get method of semN..");
    
    res.render("semN",{deptdetails});
});
app.get("/adminportal", async (req, res) => {
    // Only allow access when a user is logged in and marked as CR/admin.
    const useremail = getUser(req);
    if (!useremail || !useremail.cr || useremail.email !== ADMIN_EMAIL) {
        return res.redirect("/admin-login");
    }
    try {
        const [userCount, users, tasks] = await Promise.all([
            Register.countDocuments({}),
            Register.find({}).lean(),
            Task.find({}).lean()
        ]);
        const tasksCount = tasks.length;
        res.render("adminportal", { useremail, userCount, users, tasks, tasksCount });
    } catch (err) {
        console.error("Failed to load admin portal", err);
        res.status(500).send("Unable to load admin portal");
    }
})
app.get("/admin-login",(req,res)=>{
    res.render("adminlogin");
})
app.post("/admin-login", loginLimiter, async (req,res)=>{
    try{
        const email = (req.body.email || "").trim();
        const password = (req.body.password || "").trim();
        if(!email || !password){
            return res.status(400).send("Email and password required.");
        }
        const candidate = await Register.findOne({email});
        if(!candidate || !candidate.cr || candidate.email !== ADMIN_EMAIL){
            return res.status(401).send("Not authorized for admin portal.");
        }
        const isMatch = await bcrypt.compare(password,candidate.password);
        if(!isMatch){
            return res.status(401).send("Invalid admin credentials.");
        }
        req.session.user = {
            _id: candidate._id,
            username: candidate.username,
            email: candidate.email,
            cr: candidate.cr,
            sem: candidate.sem
        };
        const [userCount, users, tasks] = await Promise.all([
            Register.countDocuments({}),
            Register.find({}).lean(),
            Task.find({}).lean()
        ]);
        const tasksCount = tasks.length;
        return res.status(200).render("adminportal",{useremail:req.session.user,userCount,users,tasks,tasksCount});
    }catch(err){
        console.error("Admin login failed",err);
        return res.status(500).send("Unable to login admin");
    }
})

app.get("/logout",(req,res)=>{
    req.session.destroy(()=> {
        return res.redirect("/");
    });
})
app.get("/assingment",(req,res)=>{
    Task.find({})
    .then((x)=>{
        res.render("assingment",{x,useremail:getUser(req)});
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
        res.render("timetable",{x,useremail:getUser(req)});
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
        res.render("notice",{x,useremail:getUser(req)});
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
            res.render("club",{x,useremail:getUser(req)});
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
        const use=getUser(req);
        if(!use){
            return res.redirect("/");
        }
        const semKey = use.sem || "admin";
        let semdetails=await Sem.findOne({sem:semKey});
        if(!semdetails){
            semdetails = await Sem.create({sem:semKey, cr: use.cr ? 1 : 0, stu: []});
        }
        res.render("addstu",{semdetails,useremail:use});
    })
    app.post("/create-stu",async(req,res)=>{
           const roll=req.body.roll;
           const use=getUser(req);
           if(!use){
            return res.redirect("/");
           }
          const semKey = use.sem || "admin";
          const rollNum = Number(roll);
          if(Number.isNaN(rollNum)){
            return res.status(400).send("Invalid roll number");
          }
          await Sem.findOneAndUpdate(
            {sem:semKey},
            { $setOnInsert: { cr: use.cr ? 1 : 0 }, $addToSet:{stu:rollNum}},
            {upsert:true}
          );
          await Register.findOneAndUpdate({roll:rollNum},{$set:{sem:semKey}});
        res.redirect("back");
        
    });
    app.get("/delete-stu",async(req,res)=>{
        const rollnums=req.query;
        console.log(rollnums);
        const use=getUser(req);
        if(!use){
            return res.redirect("/");
        }
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
        res.render("stuhome",{useremail:getUser(req)});
    })
    app.get("/stuassing",async(req,res)=>{
        Task.find({})
        .then((x)=>{
            res.render("stuassing", { x: x, useremail: getUser(req) });
            console.log(x);
        })
        .catch((y)=>{
            console.log(y);
        })
    })
    app.get("/stunotice",async(req,res)=>{
        Notice.find({})
        .then((x)=>{
            res.render("stunotice", { x: x, useremail: getUser(req) });
            console.log(x);
        })
        .catch((y)=>{
            console.log(y);
        })
    })
    app.get("/stuclub",async(req,res)=>{
        Clubevent.find({})
        .then((x)=>{
            res.render("stuclub", { x: x, useremail: getUser(req) });
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
            res.render("stutimetabl", { x: x, useremail: getUser(req) });
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