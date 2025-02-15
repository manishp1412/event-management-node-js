const sendResponse = (res, { 
    status = 200, 
    success = true, 
    message = "", 
    data = null, 
    error = null 
} = {}) => {
    res.status(status).json({
        success,
        status,
        message,
        data,
        error,
    });
};

module.exports = sendResponse;
