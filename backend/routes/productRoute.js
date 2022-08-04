const express = require("express");
const {
  getAllproducts,
  createProduct,
  updateProducts,
  deleteProducts,
  getProductsDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminproducts,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllproducts);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizRoles("admin"), getAdminproducts);
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizRoles("admin"), createProduct);
router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorizRoles("admin"), updateProducts)
  .delete(isAuthenticatedUser, authorizRoles("admin"), deleteProducts);

router.route("/products/:id").get(getProductsDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
