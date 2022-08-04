const Products = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// create product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Products.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// get all product
exports.getAllproducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 6;
  const productsCount = await Products.countDocuments();

  const ApiFeature = new ApiFeatures(Products.find(), req.query)
    .search()
    .filter();

  let products = await ApiFeature.query;

  let filteredProductsCount = products.length;

  ApiFeature.pagination(resultPerPage);

  // products = await ApiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// get all product -- Admin
exports.getAdminproducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Products.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// update product -- Admin
exports.updateProducts = catchAsyncErrors(async (req, res) => {
  let product = await Products.findById({ _id: req.params.id });
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // images start here --
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  // deleting images from cloudinary
  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Products.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// get product details
exports.getProductsDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Products.findById({ _id: req.params.id });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// delete product -- Admin
exports.deleteProducts = catchAsyncErrors(async (req, res) => {
  const products = await Products.findById({ _id: req.params.id });
  if (!products) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // deleting images from cloudinary
  for (let i = 0; i < products.images.length; i++) {
    await cloudinary.v2.uploader.destroy(products.images[i].public_id);
  }

  await products.remove();
  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// Create new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment: comment,
  };

  const product = await Products.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    review,
  });
});

// Get All reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Products.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Products.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Products.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
