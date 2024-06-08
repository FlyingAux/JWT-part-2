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


app.get('/profile', isLoggedIn ,function(req,res,next){
    console.log(req.user)
    res.render('profile');
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
            })

            let token = jwt.sign({email},"shhhhh")
            res.cookie('token',token);
            res.send(user);
        })
    })
})


app.get('/logout',function(req,res,next){
    res.cookie('token','')
    res.redirect('/')
})


app.get('/login',function(req,res,next){
    res.render('login');
})

app.post('/login',async function(req,res,next){
    let user = await userModel.findOne({email: req.body.email});
        if(!user) return res.send('something went wrong');
            bcrypt.compare(req.body.password , user.password,function(err,result){
                if(result) {
                    let token = jwt.sign({email: user.email},"shhhhh")
                    res.cookie('token',token);
                    res.send('you can login');
                }
                else res.send('you cant login in fool')
            })      
})


function isLoggedIn(req,res,next){
    if(req.cookies.token === '') res.redirect('/login')
        else{
            let data = jwt.verify(req.cookies.token , 'shhhhh')
            req.user = data; 
        }
        next();
}


app.listen(3000);