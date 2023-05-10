const express = require("express");
const router = express.Router();
const middlewares = require("../middlewares/authentication");
const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

router.post(
  "/create",
  middlewares.authMiddleware,
  middlewares.isAdmin,
  createProduct
);
router.get("/", middlewares.authMiddleware, getAllProducts);
router.get("/:id", middlewares.authMiddleware, getProduct);
router.put(
  "/:id",
  middlewares.authMiddleware,
  middlewares.isAdmin,
  updateProduct
);
router.delete(
  "/:id",
  middlewares.authMiddleware,
  middlewares.isAdmin,
  deleteProduct
);

module.exports = router;
