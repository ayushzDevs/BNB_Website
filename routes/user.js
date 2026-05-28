const express = require("express");
const passport = require("passport");
const userController = require("../controllers/users.js");

const router = express.Router();

const saveReturnTo = (req, res, next) => {
  res.locals.returnTo = req.session.returnTo;
  next();
};

router.get("/login", userController.renderLogin);

router.post(
  "/login",
  saveReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
  }),
  userController.login
);

router.post("/logout", userController.logout);

module.exports = router;
