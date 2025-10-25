const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async(req, res)=>{
    console.log(req.body);
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User Added successfully")
    } catch (err) {
        res.status(400).send("Error Message: "+ err.message)
    }
    
})

app.get("/user", async (req, res)=>{
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({emailId: userEmail});
        if (users.length===0) {
            res.status(404).send("User not found");

        } else {
        res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
})

app.get("/feed", async (req, res)=>{
    
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
})

app.delete("/user", async (req, res)=>{
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete({_id: userId});
        res.send("User deleted Successfully");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
})

app.patch("/user/:userId", async (req, res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
        ]
        const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        if (data?.skills.length>10) {
            throw new Error("Update not allowed");
        }
        await User.findByIdAndUpdate({_id: userId}, data, {
            runValidators: true,
        });
        
        res.send("User updated successfully");
        
    } catch (err) {
        res.status(400).send("Update Failed: "+ err.message);
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

