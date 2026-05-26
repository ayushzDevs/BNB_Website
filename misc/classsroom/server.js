const express = require('express');
const app = express();
const port = 3000;

const session = require('express-session');

app.use(session({
    secret: 'mysupersecretstring',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
}))


app.get("/test",(req,res)=>{
    res.send("Session ID: " + req.sessionID);

})

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