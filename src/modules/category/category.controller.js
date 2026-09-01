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
    const data = req.body;
    const file = req.file;

    const result = await CategoryService.createCategoryService(data,file);

    res.status(CREATED).json(apiResponse(CREATED,result,"category successfully created"))

})

// get all categories 
const updateCategoryController = asyncHandler(async (req, res) => {

})

// get all categories 
const deleteCategoryController = asyncHandler(async (req, res) => {

})

// get all categories 
const getCateoriesTreeController = asyncHandler(async (req, res) => {

});

module.exports = { getCateoriesTreeController, getAllCategoriesController, createCategoryController, updateCategoryController, deleteCategoryController }