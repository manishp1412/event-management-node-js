const express = require("express");
const router = express.Router();

const {restrictToUserRole} = require('../middlewares/auth');

const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
} = require("../controllers/user");
// Routes

router.use("/", restrictToUserRole);

router
  .route("/")
  .get(handleGetAllUsers)


router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router