const { Event, User } = require("../models");
const { getUser } = require("../services/auth");
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
  
  const authToken = req.headers.authorization;

  const user = getUser(authToken);

  console.log('event flow user ', JSON.stringify(user));
  console.log('event post body ', JSON.stringify(body));


  const result = await Event.create({
    title: body.title,
    description: body.description,
    startDate: body.startDate,
    endDate: body.endDate,
    location: body.location,
    createdBy: user.name,
  });
  return sendResponse(res, {
    status: 201,
    data: {id: result._id }
  });
}

async function handleAcceptDeclineRequest(req, res) {
  try {
    const { userId, status } = req.body;
    console.log("join event body ", JSON.stringify(req.body));

    if (!userId) {
      return res.status(400).json({ error: "Missing participant Info" });
    }

    if (!["Approved", "Declined"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ error: "Invalid Participant" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const participantIndex = event.participants.findIndex(
      (p) => p.userId.toString() === userId
    );

    if (participantIndex !== -1) {
      event.participants[participantIndex].status = status;
      event.participants[participantIndex].updatedAt = new Date();
    } else {
      event.participants.push({
        userId: userData._id,
        name: userData.full_name,
        email: userData.email,
        status: "Pending", // Default status
        requestDate: new Date(),
      });
    }

    // Save updated event
    await event.save();

    return res.status(200).json({
      status: "success",
      participant: event.participants[participantIndex] || event.participants[event.participants.length - 1],
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = {
  handleGetAllEvents,
  handleGetEventById,
  handleUpdateEventById,
  handleDeleteEventById,
  handleCreateEvent,
  handleAcceptDeclineRequest,
};
