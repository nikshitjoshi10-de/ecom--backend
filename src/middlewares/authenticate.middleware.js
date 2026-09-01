const UserModel = require("../models/user.model");
const { getUserDataById } = require("../modules/auth/auth.service");
const apiError = require("../utils/apiError");
const apiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { UNAUTHORIZED, NOT_FOUND } = require("../utils/httpStatus");
const { verifyAccessToken } = require("../utils/token");

const validattionMiddleware = asyncHandler(async(req,res,next)=>{
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        res.status(UNAUTHORIZED).json(apiError(UNAUTHORIZED,"Token not found Please login again"))
    };



    const decode = verifyAccessToken(accessToken);
   
   const userData =await getUserDataById({_id:decode.sub});
    // const userData = await UserModel.findById({_id:decode.sub});
      
    if(!userData){
        res.status(NOT_FOUND).json(apiError(NOT_FOUND,"user not found"))
    };
    req.user= userData;

    next();
});

module.exports=validattionMiddleware;