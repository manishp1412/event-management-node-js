const Participant = require("../models/participant");
const User = require("../models/user");
const Event = require("../models/event");

async function handleJoinEvent(req, res) {
  const body = req.body;
  console.log("join event body ", JSON.stringify(req.body));
  if (!body || !body.userId) {
    return res.status(400).json({ error: "Missing participant Info" });
  }

  if (
    body.status &&
    body.status !== "Pending" &&
    body.status !== "Approved" &&
    body.status !== "Declined"
  ) {
    return res.status(400).json({ error: "Invalid Default Status" });
  }
  const users = await User.find({});
  const userData = users.find((e) => e.id === body.userId);
  if (!userData) {
    return res.status(400).json({ error: "Invalid Participant" });
  }
  const participants = await Participant.find({});
  const isRequestExist = participants.find(
    (e) => e.eventId == req.params.id && e.userId == body.userId
  );
  if (isRequestExist) {
    return res
      .status(400)
      .json({
        error:
          "Event Request already created, Please wait for some time to accpet request from Admin side",
      });
  }
  const result = await Participant.create({
    eventId: req.params.id,
    userId: body.userId,
  });
  if (result._id) {
    const requestedEvent = await Event.findById(req.params.id);
    const eventData = requestedEvent.toObject();
    const newParticipant = {
        eventId: result.eventId,
        userId: result.userId,
        status: result.status
    }
    const updatedEventData = {
      ...eventData,
      participants: [...eventData.participants, newParticipant],
    };
    console.log("requestedEvent data ", JSON.stringify(requestedEvent));
    console.log("updated event data ", JSON.stringify(updatedEventData));
    await Event.findByIdAndUpdate(req.params.id, updatedEventData);
    return res.json({ status: "Success" });
  }
  console.log("created event ", result);
  return res.status(201).json({ msg: "success", id: result._id });
}

async function getEventParticipants(req, res) {
  const participants = await Participant.find({});
  const evetnParticipants = participants.filter(
    (e) => e.eventId == req.params.id
  );
  if(evetnParticipants?.length == 0) {
    return res.status(400).json({ error: "Event Not Exist" });
  }
  return res.status(201).json(evetnParticipants);
}

module.exports = {
  handleJoinEvent,
  getEventParticipants,
};
