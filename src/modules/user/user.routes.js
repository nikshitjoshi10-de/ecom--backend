const express = require('express')
const userController =require("./user.controller");
const validattionMiddleware = require('../../middlewares/authenticate.middleware');
const UserRouter = express.Router();

UserRouter.use(validattionMiddleware);


UserRouter.get("/me",userController.getOwnProfileController)

module.exports= UserRouter;