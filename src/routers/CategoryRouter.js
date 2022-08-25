import express from "express";
import {
  newCategoryValidation,
  updateCategoryValidation,
} from "../middlewares/joi-validation/JoiValidation.js";
import {
  deleteCategorybyId,
  getAllCategories,
  getCategoryById,
  hasChildCategoryById,
  insertCategory,
  updateCategoryById,
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

//Update category
router.put("/", updateCategoryValidation, async (req, res, next) => {
  try {
    if (req.body.parentId) {
      const hasChildCategory = await hasChildCategoryById(req.body._id);
      if (hasChildCategory) {
        return res.json({
          status: "error",
          message:
            "This category has a child categories, please delete or re assign them to another category before taking the action",
        });
      }
    }

    const categoryUpdate = await updateCategoryById(req.body);

    categoryUpdate?._id
      ? res.json({
          status: "success",
          message: "Category has been upated",
        })
      : res.json({
          status: "error",
          message: "Unable to update the category, please try again",
        });
  } catch (error) {
    next(error);
  }
});

//Delete category
router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const hasChildCategory = await hasChildCategoryById(_id);
    if (hasChildCategory) {
      return res.json({
        status: "error",
        message:
          "This category has a child categories, please delete or re assign them to another category before taking the action",
      });
    }
    const categoryDelete = await deleteCategorybyId(_id);

    categoryDelete?._id
      ? res.json({
          status: "success",
          message: "Category has been upated",
        })
      : res.json({
          status: "error",
          message: "Unable to add the category, please try again",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
