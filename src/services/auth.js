import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "../models/user.model.js";

const strategyOptions = {
  usernameField: "username",
  passwordField: "password",
  passReqToCallback: true,
};

const signup = async (req, username, password, done) => {
  console.log("SIGNUP!");
  try {
    const query = { username: username };
    const user = await UserModel.findOne(query);

    if (user) {
      return done(null, false, { message: "Error. El usuario ya existe." });
    }
    const newUser = new UserModel({ username, password });
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    console.log(error);
    return done(null, false, { message: "Error ineseprado." });
  }
};

const login = async (req, username, password, done) => {
  console.log("LOGIN!");
  try {
    const query = { username: username };
    const user = await UserModel.findOne(query);
    if (!user) {
      return done(null, false, { message: "Error. El usuario no fue encontrado." });
    } else {
      const match = await user.matchPassword(password);
      if (match) {
        return done(null, user);
      } else return done(null, false);
    }
  } catch (error) {
    console.log(error);
    return done(null, false, { message: "Error ineseprado." });
  }
};

export const loginFunc = new LocalStrategy(strategyOptions, login);
export const signUpFunc = new LocalStrategy(strategyOptions, signup);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  const user = await UserModel.findById(userId);
  return done(null, user);
});