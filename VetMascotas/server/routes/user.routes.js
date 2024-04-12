const express = require("express");
const UserController = require("../controllers/user.controller");
const { authenticate } = require('../config/jwt.config');

const UserRouter = express.Router();

///api/auth
UserRouter.post("/register", UserController.register);
UserRouter.post("/login", UserController.login);
UserRouter.post("/logout", UserController.logout);

UserRouter.get("/userdata",  UserController.getUserData);






module.exports = UserRouter
