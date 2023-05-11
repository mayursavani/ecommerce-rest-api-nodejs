const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    res.json(product);
  } catch (err) {
    throw new Error(err);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let products = await Product.find(JSON.parse(queryStr))
      .sort(req.query.sort ? req.query.sort : { createdAt: -1 })
      .select(
        req.query.fields
          ? req.query.fields.split(",").join(" ")
          : "-__v -totalItems"
      )
      .skip(
        req.query.page && req.query.limit
          ? (req.query.page - 1) * req.query.limit
          : 0
      )
      .limit(req.query.limit);
    const totalItems = await Product.countDocuments();
    products[0].totalItems = totalItems;
    res.json(products);
  } catch (err) {
    throw new Error(err);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  if (req.body.title) {
    req.body.slug = g = slugify(req.body.title);
  }
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updateProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(
      { _id: req.params.id },
      { new: true }
    );
    res.json(deleteProduct);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
