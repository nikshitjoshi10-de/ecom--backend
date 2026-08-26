const apiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const { OK } = require("../../utils/httpStatus");
const getOwnProfileService = require("./user.service");

// User profile api services
const getOwnProfileController =asyncHandler(async(req,res)=>{

const userData = await getOwnProfileService(req.user._id);

res.status(OK).json(apiResponse(OK,userData,"data fetch successfully"))

})


module.exports= {
    getOwnProfileController
}