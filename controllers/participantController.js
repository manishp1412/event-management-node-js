const Participant = require("../models/participant");
const User = require("../models/user");
const Event = require("../models/event");

async function handleJoinEvent(req, res) {
  const { userId, status } = req.body;
  console.log("join event body ", JSON.stringify(req.body));
  if (!userId) {
    return res.status(400).json({ error: "Missing participant Info" });
  }

  if (status && !["Pending", "Approved", "Declined"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const userData = await User.findOne({ _id: userId });
  if (!userData) {
    return res.status(400).json({ error: "Invalid Participant" });
  }

  const event = await Event.findOne({ _id: req.params.id });
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  const isRequestExist = event.participants.some(
    (p) => p.userId.toString() === userId
  );
  if (isRequestExist) {
    return res.status(400).json({
      error: "Request already exists. Please wait for admin approval.",
    });
  }

  const newParticipant = {
    userId: userData._id,
    name: userData.full_name,
    email: userData.email,
    status: status || "Pending",
    requestDate: new Date(),
  };

  event.participants.push(newParticipant);

  await event.save();

  return res.status(200).json({ status: "success", participant: newParticipant });
}

async function getEventParticipants(req, res) {
  const eventId = req.params.id;
  const event = await Event.findOne({ _id: eventId });
  const participants = event.participants;
  if (participants?.length == 0) {
    return res.status(400).json({ error: "No Participant Found" });
  }
  return res.status(201).json(participants);
}

module.exports = {
  getEventParticipants,
  handleJoinEvent,
};
