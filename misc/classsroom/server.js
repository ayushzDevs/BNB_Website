const express = require('express');
const app = express();
const port = 3000;
const userRoutes = require('./user.js');
const postRoutes = require('./post.js');



app.get("/", (req, res) => {
    res.send("Welcome to the homepage!");
});

app.use('/users', userRoutes);
app.use('/posts', postRoutes);




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});