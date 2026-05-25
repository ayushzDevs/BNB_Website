const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello World!");
});

router.get("/:id", (req, res) => {  
    res.send(`User ID: `)
});

router.post("/", (req, res) => {
    res.send("User created successfully!");
});

router.delete("/:id", (req, res) => {
    res.send(`User deleted successfully!`);
});

module.exports = router;

