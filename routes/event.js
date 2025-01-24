const express = require("express");
const router = express.Router();

const {
  handleCreateEvent,
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEventById,
  handleDeleteEventById,
} = require("../controllers/event");

const {handleJoinEvent, getEventParticipants} = require("../controllers/participant");
// Routes

router
  .route("/")
  .post(handleCreateEvent)
  .get(handleGetAllEvents);


router
  .route("/:id")
  .get(handleGetEventById)
  .put(handleUpdateEventById)
  .patch(handleUpdateEventById)
  .delete(handleDeleteEventById);

router
  .route("/:id/join")
  .post(handleJoinEvent);

router
  .route("/:id/participants")
  .get(getEventParticipants)


module.exports = router