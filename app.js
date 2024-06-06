const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const userModel = require('./models/user');
const { log } = require('console');


app.set('view engine',"ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

app.use(cookieParser());

app.get('/',function(req,res,next){
    res.render('index');
});


app.post('/create',function(req,res,next){
    let {username,email,password,age} = req.body;

    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(password,salt,async function(err,hash){
            let user = await userModel.create({
                username,
                email,
                password: hash,
                age
            });
            res.send(user);
        })
    })
})

app.listen(3000);