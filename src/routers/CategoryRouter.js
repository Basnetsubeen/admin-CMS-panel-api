import express from "express";
import { newCategoryValidation } from "../middlewares/joi-validation/JoiValidation.js";
import {
  deleteCategory,
  getAllCategories,
  getCategoryById,
  insertCategory,
} from "../models/category/CategoryModel.js";
import slugify from "slugify";

const router = express.Router();

//Get Categories
router.get("/", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const categories = _id
      ? await getCategoryById(_id)
      : await getAllCategories();

    res.json({
      status: "success",
      message: "Category List",
      categories,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// Insert new category
router.post("/", newCategoryValidation, async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name, {
      lower: true,
      trim: true,
    });
    const result = await insertCategory(req.body);

    result?._id
      ? res.json({
          status: "success",
          message: "New Category has been added",
        })
      : res.json({
          status: "error",
          message: "Unable to add the category, please try again",
        });
  } catch (error) {
    next(error);
  }
});
//Get Categories
router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const result = await deleteCategory(_id);
    if (result._id) {
      return res.json({
        status: "success",
        message: "The transaction has been deleted",
      });
    }

    res.json({
      status: "error",
      message: "Invalid user",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

export default router;
