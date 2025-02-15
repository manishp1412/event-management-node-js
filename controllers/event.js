const Event = require("../models/event");
const sendResponse = require("../utils/sendResponse");
async function handleGetAllEvents(req, res) {
  const allEvents = await Event.find({});
  return sendResponse(res, {
    data: allEvents
  });
}

async function handleGetEventById(req, res) {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return sendResponse(res, {
      success: false,
      status: 404,
      error: 'Event Not Found'
    });
  }
  return sendResponse(res, {
    data: event
  });
}

async function handleUpdateEventById(req, res) {
  const { id } = req?.params;
  const body = req.body;
  await Event.findByIdAndUpdate(id, body);
  return sendResponse(res);
}

async function handleDeleteEventById(req, res) {
  const { id } = req?.params;
  await Event.findByIdAndDelete(id);
  return sendResponse(res);
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
    return sendResponse(res, {
      success: false,
      status: 400,
      error: 'All fields are required to create event'
    });
  }
  const events = await Event.find({});
  const isEventExist = events.find(e => (e.title === body.title));
  if(isEventExist) {
    return sendResponse(res, {
      success: false,
      status: 404,
      error: 'Event already exist'
    });
  }
  const result = await Event.create({
    title: body.title,
    description: body.description,
    startDate: body.startDate,
    endDate: body.endDate,
    location: body.location,
    participants: body.participants
  });
  return sendResponse(res, {
    status: 201,
    data: {id: result._id }
  });
}

module.exports = {
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEventById,
  handleDeleteEventById,
  handleCreateEvent,
};
