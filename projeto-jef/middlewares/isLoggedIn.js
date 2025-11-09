function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    req.flash("error", "Você precisa estar logado para acessar essa página.");
    return res.redirect("/auth/login");
  }
  next();
}

module.exports = isLoggedIn;
