const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport');

const app = express();


app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json);

app.use(cookieSession({
    name: 'studentBuild',
    keys: ['key1', 'key2']
  }))

const isLoggedin = (req, res, next) => {
    if(req, res){
        next();
    }else{
        res,sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());


const PORT = process.env.PORT || 3000


app.get('/',(req, res) => res.send("you have been logged out"));
app.get('/good', isLoggedin,(req, res) => res.send("Wow!!, Welcome Mr ${req.user.email}"));
app.get('/failed', (req, res) => res.send("Yey, you have failed to login"));

app.get('/google',
passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  });

app.get('/logout', (req, res) =>{
    res.session = null;
    req.logout();
    res.redirect('/');
})



app.listen(PORT, console.log(`Server running on ${PORT}`));
