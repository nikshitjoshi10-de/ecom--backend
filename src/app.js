const express = require("express");
const helmet = require("helmet");
const apiResponse = require("./utils/apiResponse")
const AuthRouter = require("./modules/auth/auth.routes");
const UserRouter = require("./modules/user/user.routes");
const CategoryRouter= require("./modules/category/category.routes")
require("dotenv").config();
const cookieParser = require('cookie-parser');
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");
const asyncHandler = require("./utils/asyncHandler");
const BrandRouter = require("./modules/brand/brand.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

// All routes 
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/brands", BrandRouter);
app.use("/api/v1/products", ProductRouter);






app.get('/api/v1/health', (req, res) =>
    res.status(200).json(apiResponse(200, {
        service: 'ecom-backend', env: process.env.NODE_ENV,
        uptimeSeconds: Math.round(process.uptime()), timestamp: new Date().toISOString(),
    }, 'API	is	running')));

app.get('/api/v1/boom', asyncHandler(async () => {
    throw apiError(418, 'This	error	was	thrown	on	purpose	to	test	errorHandler');
}));


app.use(notFound);
app.use(errorHandler);

module.exports = app;
