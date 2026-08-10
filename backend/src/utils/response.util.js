/**
 * Standard Success Response Helper
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {*} data
 * @param {string} [message]
 */
const sendSuccess = (res, statusCode = 200, data = null, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Standard Error Response Helper
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {string} [code]
 * @param {*} [details]
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', code = 'INTERNAL_ERROR', details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
