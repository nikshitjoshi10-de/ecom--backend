const asyncHandler = require("../utils/asyncHandler");
const { OK } = require("../utils/httpStatus");



const getBrandsController
=asyncHnadler(async(req,res)=>{
    const result= await   Brandservice.getBrandsController
})



const createBrandController = asyncHandler(async
    (req,res) => {
        const result = await BrandService.BrandService.getallBrandsService();

        res.status(OK).json(apiResponse)
    }
)