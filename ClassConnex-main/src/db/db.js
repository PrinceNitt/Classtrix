const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// Load environment variables from the application directory.
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const dbUri =
    process.env.DATABASE_LOCAL ||
    process.env.DATABASE ||
    "mongodb://127.0.0.1:27017/classconnex";

mongoose
    .connect(dbUri)
    .then(() => {
        const connectionType = dbUri.startsWith("mongodb+srv://") ? "Atlas" : "MongoDB";
        console.log(`${connectionType} connection established`);
    })
    .catch((error) => {
        // Never log the connection string: it may contain database credentials.
        console.error("MongoDB connection failed:", error.message);
    });
