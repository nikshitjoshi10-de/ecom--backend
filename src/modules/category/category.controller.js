const apiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const { OK, CREATED } = require("../../utils/httpStatus");
const CategoryService = require("./category.service")
// get all categories 

const getAllCategoriesController = asyncHandler(async (req, res) => {

    const result = await CategoryService.getAllcategoriesService();

    res.status(OK).json(apiResponse(OK, result, "fetch all categories"))
});

// create categories 
// two levels 
// check parent ==undefind ;
// file category image handle
// save to db


const createCategoryController = asyncHandler(async (req, res) => {
    console.log("incoming body:", req.body);
    const data = req.body;
    const file = req.file;

    const result = await CategoryService.createCategoryService(data, file);

    res.status(CREATED).json(apiResponse(CREATED, result, "category successfully created"))

})

// update categories 
// 
const updateCategoryController = asyncHandler(async (req, res) => {
    const categoryResource = req.resource;
    const patchData = req.body;
    const fileData = req.file;
    console.log(categoryResource, patchData, fileData)
    const result = await CategoryService.updateCategoryService(categoryResource, patchData, fileData);

    res.status(OK).json(apiResponse(OK, result, "update category successfully"))
})

// get all categories 
const deleteCategoryController = asyncHandler(async (req, res) => {

    const result = await CategoryService.deleteCategoryService(req.resource);

    res.status(OK).json(apiResponse(OK, result, "category deleted successfully"))
})

// get all categories 
const getCateoriesTreeController = asyncHandler(async (req, res) => {
const categoriesTree= await CategoryService.categoryTreeService();


res.status(OK).json(apiResponse(OK,categoriesTree,"category tree data fetched successfully"))
});

module.exports = { getCateoriesTreeController, getAllCategoriesController, createCategoryController, updateCategoryController, deleteCategoryController }