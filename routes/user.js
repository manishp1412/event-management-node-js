const express = require("express");
const router = express.Router();

const {verifyUserRole} = require('../middlewares/auth');

const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
} = require("../controllers/user");
// Routes

router.use("/", verifyUserRole);

router
  .route("/")
  .get(handleGetAllUsers)


router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router