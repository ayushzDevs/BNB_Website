const renderLogin = (req, res) => {
  res.render("users/login.ejs");
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

module.exports = { renderLogin, login, logout };
