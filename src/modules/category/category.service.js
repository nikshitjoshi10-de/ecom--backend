const CategoryModel = require("../../models/category.model");
const apiError = require("../../utils/apiError");
const { CONFLICT } = require("../../utils/httpStatus");


const getAllcategoriesService = async () => {
    const result = await CategoryModel.find({ isActive: true }).lean();
    return result;
};

const levelCheck = async (parentId) => {
    if (!parentId) {
        return null;
    };
    const parent = await CategoryModel.findById(parentId);
    if (parent.parent) {
        throw apiError(BAD_REQUEST, "Only two levels are allowed")
    };
    return parent._id;

}

const createCategoryService = async (payload, file) => {
    const isExist = await CategoryModel.findOne({ slug: payload.slug })
    if (isExist) {
        throw apiError(CONFLICT, "category already exist")
    };

    const parent = await levelCheck(payload.parent);
    payload.parent = parent;
    if (file) {
        const image = await uploadToCloudinary(file.buffer, "ecom/category");
        payload.image = image;
    }

    const result = await CategoryModel.create(payload);

    return result;

};




module.exports = { getAllcategoriesService, createCategoryService }

