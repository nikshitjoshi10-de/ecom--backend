const express = require('express')
const userController =require("./user.controller");
const validattionMiddleware = require('../../middlewares/authenticate.middleware');
const { upload } = require('../../middlewares/upload.middleware');
const verifyImageType = require('../../middlewares/verifyImage');
const UserRouter = express.Router();

UserRouter.use(validattionMiddleware);

//   +++++++ User apis ++++++++

// get own user profile
UserRouter.get("/me",userController.getOwnProfileController);

// update own use profile4.
UserRouter.patch("/me",upload.single("profilePhoto"),userController.updateOwnProfileController);

// get user addresses
UserRouter.get("/me/addresses",userController.getAllAddressesController);

// create user address 
UserRouter.post("/me/addresses",userController.createAddressController);

// update user address 
UserRouter.patch("/me/addresses/:addrId",userController.updateAddressController);

// delete user address 
UserRouter.delete("/me/addresses/:addrId",userController.deleteAddressController);

// ++++++ Admin apis ++++++

// user status update api
UserRouter.patch("/:id/status",userController.updateUserStatusController);


// delete user api
UserRouter.delete("/:id",userController.deleteUserController);


// get all users and sellers 
UserRouter.get("/",userController.getAllusersController);


module.exports= UserRouter;