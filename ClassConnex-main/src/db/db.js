const mongoose=require('mongoose');
mongoose.set('strictQuery', false);

// Load env vars from project root .env (when started from project root)
require("dotenv").config({ path: "./.env" });

// Prefer Atlas via DATABASE, otherwise allow local development via DATABASE_LOCAL or localhost
const dbUri =
    process.env.DATABASE_LOCAL ||
    process.env.DATABASE ||
    "mongodb://127.0.0.1:27017/classconnex";

mongoose
    .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(`MongoDB connected: ${dbUri.includes("mongodb+srv") ? "Atlas" : dbUri}`);
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });