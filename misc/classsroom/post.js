const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("List of posts");
});

router.get("/:id", (req, res) => {
    res.send(`Post ID: ${req.params.id}`);
});

router.post("/", (req, res) => {
    res.send("Post created successfully!");
});

router.delete("/:id", (req, res) => {
    res.send(`Post deleted successfully!`);
});


module.exports = router;


