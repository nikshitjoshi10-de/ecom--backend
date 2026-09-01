const apiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const { OK, UNAUTHORIZED } = require("../../utils/httpStatus");
const userServices = require("./user.service");

// ++++++users Apis controller ++++++++++++

// User profile api services
const getOwnProfileController = asyncHandler(async (req, res) => {
    const userData = await userServices.getOwnProfileService(req.user._id);

    res.status(OK).json(apiResponse(OK, userData, "data fetch successfully"));
});

// update controller
const updateOwnProfileController = asyncHandler(async (req, res) => {
    const id = req.user._id;
    const data = req.body;
    const image = req.file;

    let allowed = ["name", "phone"];
    if (req.user.role === "seller") {
        allowed.push("shopName");
    }
    const invalidFields = Object.keys(data).filter(
        (key) => !allowed.includes(key),
    );
    if (invalidFields.length > 0) {
        return res.status(UNAUTHORIZED).json(apiResponse(UNAUTHORIZED, null, `You are unauthorized to update: ${invalidFields.join(", ")}`,),);
    }

    const result = await userServices.updateProfileService(id, data, image);
    res.status(OK).json(apiResponse(OK, result, "Profile updated successfully"));
});

// get all addresses controller
const getAllAddressesController = asyncHandler(async (req, res) => {

    const addresses = await userServices.getAllAddressService(req.user._id);

    res.status(OK).json(apiResponse(OK, addresses, "fetch all user addresses"));
});

// create addresss controller
const createAddressController = asyncHandler(async (req, res) => {
    const id = req.user._id;
    const data = req.body;
    const result = await userServices.createAddressService(id, data)

    res.status(OK).json(apiResponse(OK, result, "address created succesfully"));
});

// update address controller
const updateAddressController = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const addressId = req.params.addrId;
    const patch = req.body;

    const result = await userServices.updateAddressService(userId, addressId, patch);

    res.status(OK).json(apiResponse(OK, result, "address updated successfully"));
});

// delete controller
const deleteAddressController = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const addressId = req.params.addrId;

    const result = await userServices.deleteAddressService(userId, addressId);

    res.status(OK).json(apiResponse(OK, result, "address deleted successfully"));
});

// +++ admin apis controllers ++++++
// update user status controller
const updateUserStatusController = asyncHandler(async (req, res) => {
    res.status().json(apiResponse());
});

// delete user controller
const deleteUserController = asyncHandler(async (req, res) => {
    res.status().json(apiResponse());
});

// get all users and sellers controller
const getAllusersController = asyncHandler(async (req, res) => {
    res.status().json(apiResponse());
});

module.exports = {
    getOwnProfileController,
    updateOwnProfileController,
    getAllAddressesController,
    createAddressController,
    updateAddressController,
    deleteAddressController,
    updateUserStatusController,
    deleteUserController,
    getAllusersController,
};


