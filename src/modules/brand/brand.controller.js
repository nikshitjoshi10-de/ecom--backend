const apiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const { OK, CREATED } = require("../../utils/httpStatus");
const BrandService = require("./brand.service");

const getBrandsController = asyncHandler(async (req, res) => {
    const result = await BrandService.getAllBrandsService();

    res.status(OK).json(apiResponse(OK, result, "all brands data fetched successfully"))
})

const createBrandController = asyncHandler(async (req, res) => {
    const result = await BrandService.createBrandService(req.body,req.file);
    res.status(CREATED).json(apiResponse(CREATED, result, "brand created successfully"))
})

const updateBrandController = asyncHandler(async (req, res) => {
    const result = await BrandService.updateBrandService(req.resource,req.body,req.file);

    res.status(OK).json(apiResponse(OK, result, "Brand update successfully"))
})

const deleteBrandController = asyncHandler(async (req, res) => {
    const result = await BrandService.deleteBrandService(req.resource);

    res.status(OK).json(apiResponse(OK, result, "Delete brand successfully"))
});

module.exports = { deleteBrandController, updateBrandController, createBrandController, getBrandsController }