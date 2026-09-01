
const express = require("express");
const authRouter = express.Router();
const AuthController = require("./auth.controller");
const validattionMiddleware = require("../../middlewares/authenticate.middleware");

// Register Api
authRouter.post("/register",AuthController.registerController);

// Login Api
authRouter.post("/login",AuthController.loginController);

// Refresh Api
authRouter.post("/refresh",AuthController.refreshController);

// Logout Api
authRouter.post("/logout",validattionMiddleware,AuthController.logoutController);

// Change-Password Api
authRouter.post("/changePassword",validattionMiddleware,AuthController.changePasswordController);

module.exports = authRouter;