const {getUser} = require('../services/auth');
async function restrictUnAuthorisedUser(req, res, next) {
    const authToken = req.headers.authorization;
    console.log('authToken data', authToken);
    if(!authToken) {
        return res.status(404).json({error: 'Bad Request'});
    }

    const user = getUser(authToken);

    if(!user) {
        return res.status(404).json({error: 'User not found'});
    }

    next();
  };

async function verifyUserRole(req, res, next) {
    const authToken = req.headers.authorization;
    const user = getUser(authToken);
    const isOrganizer = user.role === 'Organizer';
    console.log('isOrganizer ', isOrganizer);
    if(!isOrganizer) {
        return res.status(400).json({error: 'Access Denied: Insufficient Permissions'});
    }
    next();
  };

module.exports = { restrictUnAuthorisedUser, verifyUserRole };
