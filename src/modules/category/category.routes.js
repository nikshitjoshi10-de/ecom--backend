const express = require("express");
const CategoryController = require("./category.controller");
const { upload } = require("../../middlewares/upload.middleware");
const categoryRouter = express.Router();

// get all categories tree
categoryRouter.get("/tree",CategoryController.getCateoriesTreeController);

// get all categories
categoryRouter.get("/",CategoryController.getAllCategoriesController);

// create Category
categoryRouter.post("/",upload.single("image"),CategoryController.createCategoryController);

// update Category
categoryRouter.patch("/:id",CategoryController.updateCategoryController);

// delete category
categoryRouter.delete("/:id",CategoryController.deleteCategoryController);



module.exports =categoryRouter;