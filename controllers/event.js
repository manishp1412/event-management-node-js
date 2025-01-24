const Event = require("../models/event");
async function handleGetAllEvents(req, res) {
  const allEvents = await Event.find({});
  return res.json(allEvents);
}

async function handleGetEventById(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ error: "Event Not Found" });
  }
  return res.json(event);
}

async function handleUpdateEventById(req, res) {
  const { id } = req?.params;
  const body = req.body;
  await Event.findByIdAndUpdate(id, body);
  return res.json({ status: "Success" });
}

async function handleDeleteEventById(req, res) {
  const { id } = req?.params;
  await Event.findByIdAndDelete(id);
  return res.json({ status: "Success" });
}


async function handleCreateEvent(req, res) {
  const body = req.body;
  console.log('event post body ', JSON.stringify(req.body));
  if (
    !body ||
    !body.title ||
    !body.description ||
    !body.startDate ||
    !body.endDate ||
    !body.location
  ) {
    return res.status(400).json({ error: "All fields are required to create event" });
  }
  const events = await Event.find({});
  const isEventExist = events.find(e => (e.title === body.title));
  if(isEventExist) {
    return res.status(404).json({error: 'Event already exist'});
  }
  const result = await Event.create({
    title: body.title,
    description: body.description,
    startDate: body.startDate,
    endDate: body.endDate,
    location: body.location,
    participants: body.participants
  });
  console.log("created event ", result);
  return res.status(201).json({ msg: "success", id: result._id });
}

module.exports = {
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEventById,
  handleDeleteEventById,
  handleCreateEvent,
};
