const { getUser } = require("../services/auth");
const sendResponse = require("../utils/sendResponse");

async function checkForAuthentication(req, res, next) {
  const authToken = req.headers.authorization;
  req.user = null;

  if (!authToken)
    return sendResponse(res, {
      status: 401,
      message: 'Unauthorized',
      error: 'Unauthorized'
    });
  // return res.status(401).json({message: 'Unauthorized'});

  const user = getUser(authToken);

  req.user = user;

  return next();
}

async function restrictToUserRole(req, res, next) {
  if (!req.user) {
    return sendResponse(res, {
      status: 401,
      message: 'Unauthorized',
      error: 'Unauthorized'
    });
    // return res.status(401).json({ message: "Unauthorized" });
  }

  console.log("current user role ", req.user.role);
  const isOrganizer = req.user.role === "Organizer";
  if (!isOrganizer) {
    return sendResponse(res, {
      status: 403,
      message: 'No Permission',
      error: 'No Permission'
    });
    // return res.status(403).json({ message: "No Permission" });
  }
  next();
}

module.exports = { checkForAuthentication, restrictToUserRole };
