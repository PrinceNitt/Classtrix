
//console.log("om sai ram");
const express = require('express');
const path=require("path");
const app=express();
const hbs=require("hbs");
const bcrypt = require("bcryptjs"); 
const multer=require('multer');
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const nodemailer = require("nodemailer");
require('dotenv').config();
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

const resetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
});

const forgotLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
});

const requireAuth = (req, res, next) => {
    if (!getUser(req)) return res.redirect("/");
    next();
};

const adminOnly = (req, res, next) => {
    const user = getUser(req);
    if (!user || !user.cr || user.email !== ADMIN_EMAIL) {
        return res.redirect("/admin-login");
    }
    next();
};

// Email (SMTP) configuration for password reset
const SMTP_HOST = process.
env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER;

const transporter = (SMTP_USER && SMTP_PASS)
  ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    })
  : null;

const sendResetEmail = async (to, code) => {
    if (!transporter) return false;
    await transporter.sendMail({
        from: MAIL_FROM,
        to,
        subject: "ClassConneX Password Reset Code",
        text: `Your ClassConneX password reset code is ${code}. It will expire in 1 hour.`,
        html: `<p>Your ClassConneX password reset code is <strong>${code}</strong>.</p><p>This code will expire in 1 hour.</p>`
    });
    return true;
};

const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

const static_path=path.join(__dirname,"../public");
const template_path =path.join(__dirname,"../templates/views");

app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({
    name: "classconnex.sid",
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        maxAge: 1000 * 60 * 60 * 4 // 4 hours
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
app.get("/adminportal", adminOnly, async (req, res) => {
    try {
        const [userCount, users, tasks] = await Promise.all([
            Register.countDocuments({}),
            Register.find({}).lean(),
            Task.find({}).lean()
        ]);
        const tasksCount = tasks.length;
        res.render("adminportal", { useremail: getUser(req), userCount, users, tasks, tasksCount });
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
app.get('/upload', adminOnly, function(req,res,next)
{
    Timetable.find({})
    .then((x)=>{
        res.render("timetable",{x,useremail:getUser(req)});
        console.log(x);
    })
    .catch((y)=>{
        console.log(y);
    })
});


app.post('/upload', adminOnly, upload, async(req,res,next)=>{
    var imageFile=req.file.filename;
    var success =req.file.filename+"uploaded successfully";
    var imagedetails=new Timetable({
        image:imageFile
    });
    const tabl= await  imagedetails.save();
  res.redirect("back");
})


app.get("/notice", adminOnly, (req,res)=>{
    Notice.find({})
    .then((x)=>{
        res.render("notice",{x,useremail:getUser(req)});
        console.log(x);
    })
    .catch((y)=>{
        console.log(y);
    })

});

app.post("/create-notice", adminOnly, async(req,res)=>{
    const notice=new Notice({
        description:req.body.description,
         subject:req.body.subject,
        date:req.body.date
    });

    const announce= await notice.save();
    res.redirect("back");
    
});

app.get("/delete-notice", adminOnly, async(req,res)=>{
    var id=req.query;
    var count=Object.keys(id).length;
    for(let i=0;i<count;i++){
        await Notice.findByIdAndDelete(Object.keys(id)[i])
    }
    return res.redirect('back');
    })

    app.get("/club", adminOnly, (req,res)=>{
        Clubevent.find({})
        .then((x)=>{
            res.render("club",{x,useremail:getUser(req)});
            console.log(x);
        })
        .catch((y)=>{
            console.log(y);
        })
    
    });
    
    app.post("/create-clubevent", adminOnly, async(req,res)=>{
        const clubevent=new Clubevent({
            description:req.body.description,
            club:req.body.club,
            date:req.body.date
        });
    
        const announce= await clubevent.save();
        res.redirect("back");
        
    });
    
    app.get("/delete-clubevent", adminOnly, async(req,res)=>{
        var id=req.query;
        var count=Object.keys(id).length;
        for(let i=0;i<count;i++){
            await Clubevent.findByIdAndDelete(Object.keys(id)[i])
        }
        return res.redirect('back');
        })
    
    


    app.get("/addstu", requireAuth, async(req,res)=>{
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
    app.post("/create-stu", requireAuth, async(req,res)=>{
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
    app.get("/delete-stu", requireAuth, async(req,res)=>{
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

    app.get("/stuhome", requireAuth, async(req,res)=>{
        res.render("stuhome",{useremail:getUser(req)});
    })
    app.get("/stuassing", requireAuth, async(req,res)=>{
        Task.find({})
        .then((x)=>{
            res.render("stuassing", { x: x, useremail: getUser(req) });
            console.log(x);
        })
        .catch((y)=>{
            console.log(y);
        })
    })
    app.get("/stunotice", requireAuth, async(req,res)=>{
        Notice.find({})
        .then((x)=>{
            res.render("stunotice", { x: x, useremail: getUser(req) });
            console.log(x);
        })
        .catch((y)=>{
            console.log(y);
        })
    })
    app.get("/stuclub", requireAuth, async(req,res)=>{
        Clubevent.find({})
        .then((x)=>{
            res.render("stuclub", { x: x, useremail: getUser(req) });
            console.log(x);
        })
        .catch((y)=>{
            console.log(y);
        })
    })
    app.get('/stutimetabl', requireAuth, function(req,res,next)
    {
        Timetable.find({})
        .then((x)=>{
            res.render("stutimetabl", { x: x, useremail: getUser(req) });
            console.log(x);
        })
        .catch((y)=>{
            console.log(y);
        })
    });

// Forgot Password Routes
app.get("/forgot-password", forgotLimiter, (req, res) => {
    res.render("forgotpassword", { message: null });
});

app.post("/forgot-password", forgotLimiter, async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.render("forgotpassword", { message: "Please enter your email", type: "error" });
        }

        const user = await Register.findOne({ email: email.toLowerCase().trim() });
        
        if (!user) {
            return res.render("forgotpassword", { 
                message: "If this email exists, you will receive reset instructions.", 
                type: "success"
            });
        }

        // Generate reset token (simple 6-digit code)
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Set token and expiry (1 hour from now)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        
        await user.save();

        let emailSent = false;
        try {
            emailSent = await sendResetEmail(user.email, resetToken);
        } catch (err) {
            console.error("Error sending reset email", err);
        }

        const message = emailSent
            ? "We have emailed you a reset code. Please check your inbox and spam folder."
            : "Email sending is not configured. Contact admin to reset your password.";

        res.render("forgotpassword", { 
            message,
            type: emailSent ? "success" : "error",
            showResetLink: emailSent,
            email: email
        });

    } catch (error) {
        console.error(error);
        res.render("forgotpassword", { message: "An error occurred. Please try again.", type: "error" });
    }
});

app.get("/reset-password", resetLimiter, (req, res) => {
    res.render("resetpassword", { message: null, email: req.query.email || "" });
});

app.post("/reset-password", resetLimiter, async (req, res) => {
    try {
        const { email, resetCode, newPassword, confirmPassword } = req.body;

        if (!email || !resetCode || !newPassword || !confirmPassword) {
            return res.render("resetpassword", { 
                message: "All fields are required", 
                type: "error",
                email: email || ""
            });
        }

        if (newPassword !== confirmPassword) {
            return res.render("resetpassword", { 
                message: "Passwords do not match", 
                type: "error",
                email: email || ""
            });
        }

        if (newPassword.length < 6) {
            return res.render("resetpassword", { 
                message: "Password must be at least 6 characters", 
                type: "error",
                email: email || ""
            });
        }

        const user = await Register.findOne({
            email: email.toLowerCase().trim(),
            resetPasswordToken: resetCode,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.render("resetpassword", { 
                message: "Invalid or expired reset code", 
                type: "error",
                email: email || ""
            });
        }

        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();

        res.render("resetpassword", { 
            message: "Password reset successful! You can now login with your new password.", 
            type: "success",
            redirectToLogin: true
        });

    } catch (error) {
        console.error(error);
        res.render("resetpassword", { 
            message: "An error occurred. Please try again.", 
            type: "error",
            email: req.body.email || ""
        });
    }
});

//by default this is index page
app.listen(port,()=>{
    console.log(`listen to the ${port}`);
});