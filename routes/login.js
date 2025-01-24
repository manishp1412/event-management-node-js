const express = require("express");
const router = express.Router();

const {
    handleLogin
} = require("../controllers/user");
// Routes

router
  .route("/")
  .post(handleLogin)

module.exports = router