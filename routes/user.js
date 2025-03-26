const express = require("express");
const router = express.Router();

const {restrictToUserRole} = require('../middlewares/auth');

const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleApproveOrDeclineUser,
} = require("../controllers/userController");
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

router
  .route("/:id/approval")
  .patch(handleApproveOrDeclineUser)

module.exports = router