const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const app = express();

app.use("/admin",adminAuth)

app.get("/admin/getAllData", (req, res)=>{
    res.send("All Data Sent");
})

app.get("/admin/deleteUser", (req, res)=>{
    res.send("Deleted a user");
})

app.listen(3000, ()=>{
    console.log("Server is successfully listening on port 3000...");
})