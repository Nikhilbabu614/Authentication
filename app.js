//jshint esversion:6
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app =express();

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/authDB",{ useNewUrlParser: true ,useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});
userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password']});

const User = mongoose.model("User",userSchema);

app.get("/",function (req,res) {
    res.render("home");
});

app.get("/login",function (req,res) {
    res.render("login");
});

app.get("/register",function (req,res) {
    res.render("register");
});


app.post("/register",function (req,res) {
   const newuser  = new User({
        email:req.body.username,
        password:req.body.password
   });
   newuser.save(function (err) {
       if(err){
           res.send(err);
       }else{
            res.render("secrets");
       }
   });
});

app.post("/login",function (req,res) {

    User.findOne({email:req.body.username},function (err,data) {
       if(err){
           console.log(err);
       }else{
           if(data.password == req.body.password){
            res.render("secrets");
           }
           else
           {
               res.send("user not found");
           }
       }
    });
        
});








app.listen(3000,function () {
    console.log("server started : 3000");
})