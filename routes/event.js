const express = require("express");
const router = express.Router();

const {
  handleCreateEvent,
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEventById,
  handleDeleteEventById,
  handleAcceptDeclineRequest,
} = require("../controllers/eventController");

const {
  handleJoinEvent,
  getEventParticipants,
} = require("../controllers/participantController");
// Routes

router.route("/").post(handleCreateEvent).get(handleGetAllEvents);

router
  .route("/:id")
  .get(handleGetEventById)
  .put(handleUpdateEventById)
  .patch(handleUpdateEventById)
  .delete(handleDeleteEventById);


router.route("/:id/approve-decline").put(handleAcceptDeclineRequest);


router.route("/:id/join").post(handleJoinEvent);

router.route("/:id/participants").get(getEventParticipants);

module.exports = router;
