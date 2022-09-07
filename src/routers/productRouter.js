import express from "express";
import slugify from "slugify";
import {
  newProductValidation,
  updateProductValidation,
} from "../middlewares/joi-validation/JoiValidation.js";
import {
  addProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../models/product/PoductModel.js";
import multer from "multer";
import fs from "fs";

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
router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const products = _id ? await getProductById(_id) : await getAllProducts();
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
      const files = req.files;
      if (files.length) {
        const images = files.map((img) => img.path.slice(6));
        console.log(images);
        req.body.images = images;
        req.body.thumbnail = images[0];
      }

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
//delete products
router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const imgToDelete = req.body;

    const products = await deleteProductById(_id);
    //deleting  img from disk, not recommended in the production
    if (imgToDelete.length) {
      imgToDelete.map((item) => item && fs.unlinkSync("./public" + item));
    }
    //delete the product from the database base on the given _id

    products?._id
      ? res.json({
          status: "success",
          message: "The product has been sucessfully deleted.",
        })
      : res.json({
          status: "error",
          message: "The product cannot be deleted deleted, please try again",
        });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});
//update products
router.put(
  "/",
  upload.array("newImages", 5),
  updateProductValidation,
  async (req, res, next) => {
    try {
      const { body, files } = req;
      // console.log(req.body, req.files);

      let { images, imgToDelete } = body;
      images = images.split(",");
      imgToDelete = imgToDelete.split(", ");
      images = images.filter((img) => !imgToDelete.includes(img));

      if (files) {
        const newImages = files.map((imgObj) => imgObj.path.slice(6));
        images = [...images, ...newImages];
      }
      body.images = images;
      const product = await updateProductById(body);
      product?._id
        ? res.json({
            status: "success",
            message: "The product has been updated successfully",
          })
        : res.json({
            status: "error",
            message: "Unable to update the product, Please try again",
          });
    } catch (error) {
      error.status = 500;
      next(error);
    }
  }
);

export default router;
