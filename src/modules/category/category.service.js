const CategoryModel = require("../../models/category.model");
const apiError = require("../../utils/apiError");
const { CONFLICT, BAD_REQUEST } = require("../../utils/httpStatus");
const {convertToSlug} = require("../../utils/slug");
const { uploadToCloudinary, destroyFromCloudinary } = require("../../utils/uploadToCloudinary");





const getAllcategoriesService = async () => {
    const result = await CategoryModel.find({ isActive: true }).lean();
    return result;
};

const levelCheck = async (parentId) => {
    if (!parentId || parentId === "null" || parentId === "undefined") {
        return null;
    }
    const parent = await CategoryModel.findById(parentId);
    if (!parent) {
        throw apiError(BAD_REQUEST, "Parent category not found");
    }
    if (parent.parent) {
        throw apiError(BAD_REQUEST, "Only two levels are allowed");
    }

    return parent._id;
};

const createCategoryService = async (payload, file) => {
    const slug = convertToSlug(payload.name);
    console.log("service payload", payload)
    const isExist = await CategoryModel.findOne({ slug });
    if (isExist) {
        throw apiError(CONFLICT, "category already exist");
    }
    payload.slug = slug;

    const parent = await levelCheck(payload.parent);
    payload.parent = parent;

    if (file) {
        const image = await uploadToCloudinary(file.buffer, "ecom/category");
        payload.image = image;
    }

    const result = await CategoryModel.create(payload);
    return result;
};

// update category 
// chid exist or not 
// category can't be its own parent
// category parent hai ya nhi 
// payload me name, position ya, isActive  are not undefined then categoryData.name = payload.name;
// file is exist ( uploadTOCloudinary)==> image(URL, PublicID);
// controller return result;

const updateCategoryService = async (categoryData, payload, file) => {
    if (payload.parent !== undefined) {
        const childCount = await CategoryModel.countDocuments({ parent: categoryData._id });

        if (payload.parent && childCount > 0) {
            throw apiError(BAD_REQUEST, "This category has sub-categories, so it connot become a sub-category")
        }
        if (payload.parent && String(payload.parent) === String(categoryData._id)) {
            throw apiError(BAD_REQUEST, "A cateogry cannot be its own parent")
        }
        categoryData.parent = await levelCheck(payload.parent);

    };

    if (payload.name !== undefined) {
        categoryData.name = payload.name;
    };
    if (payload.isActive !== undefined) {
        categoryData.isActive = payload.isActive;
    };
    if (payload.position !== undefined) {
        categoryData.position = payload.position;
    };

    if (file) {
        const image = await uploadToCloudinary(file.buffer, "ecom/category");
        await destroyFromCloudinary(categoryData.image?.publicId);
        categoryData.image = image;
    };

    await categoryData.save();
    return categoryData;
}

// check any subcategory exist or not 
// any product using this category or not
// delete could data before delete category  
// delete this category;
const deleteCategoryService = async (category) => {
    const childCount = await CategoryModel.countDocuments({ parent: category._id })

    if (childCount > 0) {
        throw apiError(BAD_REQUEST, `First you have to delete subCategories ${childCount}`)
    };

    //  check any product use this category on not 
    // product count 

    await destroyFromCloudinary(category.image?.publicId);

    await category.deleteOne();

    return category;

};



const categoryTreeService = async () => {
      const getCategoryTree= await  CategoryModel.aggregate([
            { $match: { parent: null, isActive: true } },			
            { $sort: { name: 1 } },
            {
                $lookup: {
                    from: 'categories',							
                    localField: '_id',								
                    foreignField: 'parent',			
                    as:'children',										
                    pipeline: [
                        { $match: { isActive: true } },							
                        { $project: { name: 1, slug: 1 } },		
                    ],
                },
            },
            { $project: { name: 1, slug: 1, image: 1, children: 1 } },
        ]);

        return getCategoryTree;
}


module.exports = { getAllcategoriesService, createCategoryService, updateCategoryService, deleteCategoryService, categoryTreeService }