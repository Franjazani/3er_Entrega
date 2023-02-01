import passport from "passport";

const passportOptions = {
  badRequestMessage: "Error. Username o Password incorrectos",
};

export const signUp = (req, res, next) => {
  passport.authenticate("signup", passportOptions, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) return res.status(401).json(info);
    res.json({ msg: "El registro ha sido exitoso" });
  })(req, res, next);
};

export const login = (req, res, next) => {
  passport.authenticate("login", passportOptions, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Error. El usuario no fue encontrado" });
    }
    res.json({ msg: "Bienvenido", user: req.user });
  })(req, res, next);
};

export const logOut = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
    });
    res.send({ msg: "Sesión cerrada." });
  });
};