const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async(req, res)=>{
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User Added successfully")
    } catch (err) {
        res.status(400).send("Error Message: "+ err.message)
    }
    
})

connectDB()
    .then(()=>{
        console.log("Database connection established...");
        app.listen(3000, ()=>{
            console.log("Server is successfully listening on port 3000...");
        })
    })
    .catch((err)=>{
        console.error("Database cannot be connected");
    })

