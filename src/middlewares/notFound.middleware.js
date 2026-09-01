const apiError = require("../utils/apiError")

const notFound = (req,res,next)=>{
    next(apiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
};

module.exports= notFound;