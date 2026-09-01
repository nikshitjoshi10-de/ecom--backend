const express = require("express");
const CategoryController = require("./category.controller");
const { upload } = require("../../middlewares/upload.middleware");
const loadResource = require("../../middlewares/loadResource.middleware");
const CategoryModel = require("../../models/category.model");
const categoryRouter = express.Router();

// get all categories tree
categoryRouter.get("/tree",CategoryController.getCateoriesTreeController);

// get all categories
categoryRouter.get("/",CategoryController.getAllCategoriesController);

// create Category
categoryRouter.post("/",upload.single("image"),CategoryController.createCategoryController);

// update Category
categoryRouter.patch("/:id",loadResource(CategoryModel), upload.single("image"),CategoryController.updateCategoryController);

// delete category
categoryRouter.delete("/:id",loadResource(CategoryModel),CategoryController.deleteCategoryController);



module.exports =categoryRouter;