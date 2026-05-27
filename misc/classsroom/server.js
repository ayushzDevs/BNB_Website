const express = require('express');
const app = express();
const port = 3000;


const flash = require('connect-flash');

const path = require('path');
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));


const session = require('express-session');
app.use(flash());
const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}

app.use(session(sessionOptions));


app.get("/test",(req,res)=>{
    res.send("Session ID: " + req.sessionID);

})

app.get("/register",(req,res)=>{

    let {name="anonymous"} = req.query;
    req.session.name = name;
    console.log(req.session.name);
    if(name!=="anonymous"){
        req.flash('success', 'user registered successfully!')
    }
    else{
        req.flash('error', 'user not registered!')
    }
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    res.locals.successMSG = req.flash('success');
    res.locals.errorMSG = req.flash('error');
    res.render("page", { name:req.session.name });
})

// app.get("/reqcount",(req,res)=>{
//     if(req.session.views){
//         req.session.views++;
//         res.send(`You have visited this page ${req.session.views} times.`);
//     }
//     else{
//         req.session.views = 1;
//         res.send("Welcome to this page for the first time!");
//     }
// }
// )
// using express sessions




















































// using cookies


// const userRoutes = require('./user.js');
// const postRoutes = require('./post.js');

// const cookieParser = require('cookie-parser');
// app.use(cookieParser("secretcode"));




// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));




// app.get("/", (req, res) => {
//     console.dir(req.cookies);
//     res.send("Welcome to the homepage!");
// });

// app.get("/getcookies", (req, res) => {
//     res.cookie("greet","hello",{signed: true});
//     res.cookie("age", "30", { signed: true });
//     res.send("Cookie has been set!");
// });

// app.get("/verify", (req, res) => {
//     const signedCookies = req.signedCookies;
//     console.log("Signed Cookies:", signedCookies);
//     if (signedCookies.greet === "hello" && signedCookies.age === "30") {
//         res.send("Cookie is valid!");
//     } else {
//         res.send("Cookie is invalid or has been tampered with.");
//     }
// });

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/users', userRoutes);
// app.use('/posts', postRoutes);




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});