const BrandModel = require("../../models/brand.model");
const apiError = require("../../utils/apiError");
const { NOT_FOUND } = require("../../utils/httpStatus");
const {convertToSlug} = require("../../utils/slug");
const { uploadToCloudinary, destroyFromCloudinary } = require("../../utils/uploadToCloudinary");

const getAllBrandsService = async () => {
    const allBrandsData = await BrandModel.find({}).sort("name").lean();

    return allBrandsData;
}

// slug se check is exists or not
// file handle and payload.logo = file 
// db me save 
const createBrandService = async (payload, file) => {
console.log("payload",payload)
    const slug = convertToSlug(payload.name);
    console.log("service payload", slug)
    const isExist = await BrandModel.findOne({ slug });
    if (isExist) {
        throw apiError(CONFLICT, "Brand already exist");
    }
    payload.slug = slug;


    if (file) {
        const image = await uploadToCloudinary(file.buffer, "ecom/brand");
        payload.logo = image;
    }

    const result = await BrandModel.create(payload);

    return result;
}

// isExist or not=> slug
// fileds unhe update krenge brand object me 
// file old publicid delete new upload,
// databaseme save 
const updateBrandService = async (brand,payload,file) => {
  const slug = convertToSlug(payload.name);
    
    const isExist = await BrandModel.findOne({ slug });
    if (isExist) {
        throw apiError(CONFLICT, "Brand name already exist");
    }
    brand.slug = slug;

     if (payload.name !== undefined) {
        brand.name = payload.name;
    };
    if (payload.isActive !== undefined) {
        brand.isActive = payload.isActive;
    };

     if (file) {
        const image = await uploadToCloudinary(file.buffer, "ecom/brand");
        await destroyFromCloudinary(brand.logo?.publicId);
       brand.logo = image;
    };
 await brand.save();

 return brand;

}

// incomplete delete api (Product count will be adding soon )
const deleteBrandService = async (brand) => {
    // check any product is used this brand ?

    const isExist = await BrandModel.findById({_id:brand._id});
    if(!isExist){
        throw apiError(NOT_FOUND,"brand not found")
    };

    await destroyFromCloudinary(brand.logo?.publicId);

   await brand.deleteOne();
    return brand;
}

module.exports = { getAllBrandsService, deleteBrandService, updateBrandService, createBrandService }