const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const app = express();

app.get("/getUserData", (req, res)=>{
    throw new Error("wuhdbuy");
    
})

app.use("/", (err, req, res, next)=>{
    if (err) {
        res.status(500).send(err.message);
    }
})

app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000...");
})