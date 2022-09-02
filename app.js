require("dotenv").config()
require("./config/database").connect()
const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model/user")
const auth = require("./middleware/auth");


const app = express();
app.use(express.json())


app.get('/', (req, res) => {
    res.send("<h1>Hello from auth system</h1>")
});

app.post("/register", async(req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body

    if(!(email && password && firstName && lastName)) {
        res.status(400).send('All fields are required')
    }
    const existingUser = await User.findOne({email}); // THIS RETURNS PROMISE 
    if(existingUser){
        res.status(401).send("user already exists");
    }

    const myEncPassword = await bcrypt.hash(password,10)

    const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: myEncPassword,
    });

    //token
    const token = jwt.sign(
        {user_id: user._id , email},
        process.env.SECRET_KEY,
        {
            expiresIn : "2h"
        }
    )
    user.token = token 
    user.password = undefined
    res.status(201).json(user);
    } catch (error) {
        console.log(error);
    }
});

app.post("/login", async (req, res) =>{
    try {
        const {email, password} = req.body;

        if(!(email && password)){
            res.status(400).send("Field is missing")
        }
        const user = await User.findOne({email})

        // if(!user){
        //     res.status(400).send("You are not registered in our app") 
        // }

        if(user && (await bcrypt.compare(password, user.password))){
            const Token = jwt.sign(
                {user_id : user._id , email},
                process.env.SECRET_KEY,
                {
                    expiresIn : '2h'
                }
            )
            user.token = Token
            user.password = undefined
            res.status(200).json(user)
        }

        res.status(400).send("email or password is incorrect")


    } catch (error) {
        console.log(error);
    }
});

app.get("/dashboard",auth, (req, res) => {
    res.send("hello secret information");
})

module.exports = app;