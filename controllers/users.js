const User = require("../models/user.model.js");

const renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

const renderRegister = (req, res) => {
  res.render("users/register.ejs");
};

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to BNB Couples!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

const login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/listings";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out.");
    res.redirect("/listings");
  });
};

module.exports = { renderLogin, renderRegister, register, login, logout };
