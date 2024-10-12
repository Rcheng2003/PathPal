const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();

// Helper function for formatting errors
const formatValidationErrors = (errorsArray) => {
  return errorsArray.map((error) => ({ field: error.param, message: error.msg }));
};

// Register endpoint (improved error handling)
router.post(
  "/register",
  body("email").isEmail().withMessage("Must be a valid email address"),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/\d/).withMessage("Password must include at least one number")
    .matches(/[A-Z]/).withMessage("Password must include at least one uppercase letter")
    .matches(/[!@#$%^&*]/).withMessage("Password must include at least one special character"),
  async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // Check validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errorCode: "VALIDATION_ERROR", 
        errors: formatValidationErrors(errors.array())
      });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          errorCode: "EMAIL_ALREADY_EXISTS",
          errorMessage: "An account with this email already exists",
        });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      res.json({ status: "ok" });
    } catch (err) {
      res.status(500).json({
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: "Something went wrong, please try again later",
      });
    }
  }
);

// Login endpoint (improved error handling)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      errorCode: "MISSING_FIELDS",
      errorMessage: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        errorCode: "INVALID_EMAIL",
        errorMessage: "No account found with this email",
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        errorCode: "INVALID_PASSWORD",
        errorMessage: "The password you entered is incorrect",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      process.env.JWT_CODE
    );

    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: "Something went wrong, please try again later",
    });
  }
});

module.exports = router;
