const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

const errorMiddleware = require("./middleware/error");

// env file config
dotenv.config({ path: "backend/config/config.env" });

app.use(express.json({ limit: "25mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
app.use(fileUpload());

// routes imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const { processPayment } = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", processPayment);

// middleware for Errors
app.use(errorMiddleware);

module.exports = app;
