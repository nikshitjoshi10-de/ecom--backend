const UserModel = require("../../models/user.model");
const apiError = require("../../utils/apiError");
const { NOT_FOUND } = require("../../utils/httpStatus");

const getOwnProfileService = async (userId)=>{

const result = await UserModel.findById(userId);
if(!result){
    throw apiError(NOT_FOUND,"user not foundf")
}
return result;

};

module.exports= getOwnProfileService;