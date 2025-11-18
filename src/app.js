const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());
 
app.post("/signup", async(req, res)=>{
    console.log(req.body);
    

    try {
        validateSignUpData(req);

        const {firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.send("User Added successfully")
    } catch (err) {
        res.status(400).send("Error Message: "+ err.message)
    }
    
})

app.post("/login", async (req, res)=>{
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("EmailId is not present in DB");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = await jwt.sign({_id:user._id}, "DEV@Tinder$790");
            console.log(token);
            res.cookie("token", token);
            res.send ("login successful!!!");
        } else {
            throw new Error("Password is not correct");
        }
    } catch (err) {
        res.status(400).send("Error Message: "+ err.message)
    }
})

app.get("/profile", async (req, res)=>{
    try {

    
    const cookies = req.cookies;
    const {token} = cookies;
    
    if (!token) {
        throw new Error("Invalid Token");

    }
    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790")
    console.log(decodedMessage);

    const {_id} = decodedMessage;
    console.log("Logged in user is: "+ _id);
    const user = await User.findById(_id);
    if (!user) {
        throw new Error("User does not exist!");
    }
    res.send(user);
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

