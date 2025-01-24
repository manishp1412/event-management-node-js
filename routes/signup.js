const express = require("express");
const router = express.Router();

const {
  handleSignup,
} = require("../controllers/user");
// Routes

  
router
  .route("/")
  .post(handleSignup)

module.exports = router