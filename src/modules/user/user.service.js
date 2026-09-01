const UserModel = require("../../models/user.model");
const apiError = require("../../utils/apiError");
const { NOT_FOUND, FORBIDDEN } = require("../../utils/httpStatus");
const { uploadToCloudinary, destroyFromCloudinary } = require("../../utils/uploadToCloudinary");


const setOthersDefaultFalse = (currentAddressId, addresses) => {
   addresses.forEach((address) => {
        if (address._id !== currentAddressId) {
            address.isDefault = false;
        }
    });

    


}

const getOwnProfileService = async (userId) => {

    const result = await UserModel.findById(userId);
    if (!result) {
        throw apiError(NOT_FOUND, "user not found")
    }
    return result;

};

// update user profile service api 


const updateProfileService = async (id, data, file) => {
    const updatedData = { ...data };
    const user = await UserModel.findById(id);
    if (!user) {
        throw apiError(404, "User not found");
    }
    if (file) {
        const image = await uploadToCloudinary(file.buffer, "ecom/users");
        if (user.profilePhoto?.publicId) {
            await destroyFromCloudinary(user.profilePhoto.publicId);
        }
        updatedData.profilePhoto = image;
    }
    const result = await UserModel.findByIdAndUpdate(id, updatedData,
        {returnDocument: "after", runValidators: true });

    return result;
};

// get all user adderressss

const getAllAddressService = async (id) => {
    const user = await UserModel.findOne(id);

    if (!user) {
        throw apiError(NOT_FOUND, "user not found")
    };

    if (user.addresses.length <= 0) {
        throw apiError(NOT_FOUND, "you don't have any address, please create one")
    };
    return user.addresses;
}

// create address 
const createAddressService = async (id, data) => {
    const user = await getOwnProfileService(id);
    console.log("user service data", user);


    if (user?.addresses.length > 5) {
        throw apiError(FORBIDDEN, "max addresses limit reached, can't create more")
    }
    if (user?.addresses.length !== 0) {
        user?.addresses.forEach((address) => address.isDefault = false)
    };

    user.addresses.push(data);
    await user.save();

    return user;
}

const updateAddressService = async (userId, addressId, patch) => {
    const userData = await getOwnProfileService(userId);
    const address = userData.addresses.id(addressId);
    if (!address) {
        throw apiError(NOT_FOUND, "address not found")
    };

    Object.assign(address,patch);

    if(patch.isDefault){
         setOthersDefaultFalse(addressId,userData.addresses)
    };

    await userData.save();
    return userData;

}

const deleteAddressService = async (userId, addressId) => {
    const userData = await getOwnProfileService(userId);

    const address = userData.addresses.id(addressId);
    console.log("addressdata", address)
    if (!address) {
        throw apiError(NOT_FOUND, "address not found")
    };

    const wasDefault = address.isDefault;
    address.deleteOne();
    if (userData.addresses.length > 0 && wasDefault === true) {
        userData.addresses[0].isDefault = true;
    }

    await userData.save();
    return userData;

}


module.exports = { getOwnProfileService, updateProfileService, getAllAddressService, createAddressService, deleteAddressService, updateAddressService }