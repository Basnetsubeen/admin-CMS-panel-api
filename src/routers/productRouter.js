import express from "express";
import slugify from "slugify";
import { newProductValidation } from "../middlewares/joi-validation/JoiValidation.js";
import { addProduct, getAllProducts } from "../models/product/PoductModel.js";
import multer from "multer";

const router = express.Router();

//setup multer validation and upload destination
const fileUploadDestination = "public/img/products";
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let error = null;
    //validation test if needed ...
    callback(error, fileUploadDestination);
  },
  filename: (req, file, callback) => {
    const fullFileName = Date.now() + "-" + file.originalname;
    callback(null, fullFileName);
  },
});

const upload = multer({ storage });

//Get all the products
router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json({
      status: "success",
      message: " to-do",
      products,
    });
  } catch (error) {
    next(error);
  }
});
//insert all products
router.post(
  "/",
  upload.array("images", 5),
  newProductValidation,
  async (req, res, next) => {
    try {
      console.log(req.body);
      const slug = slugify(req.body.name, { lower: true, trim: true });
      req.body.slug = slug;

      const result = await addProduct(req.body);

      result?._id
        ? res.json({
            status: "success",
            message: "New product has been added",
          })
        : res.json({
            status: "error",
            message: "Unable to add the products, please try later",
          });
    } catch (error) {
      if (error.message.includes("E11000 duplicate key error collection")) {
        error.message =
          "This is already another product with same name or slug, SKU, please use another one";
        error.status = 200;
      }

      next(error);
    }
  }
);

export default router;
