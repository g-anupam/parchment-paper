import { HTTP_STATUS } from '../constants.js';

/**
 * Format successful API responses
 */
export const sendSuccess = (res, statusCode = HTTP_STATUS.OK, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};

/**
 * Format error API responses
 */
export const sendError = (res, statusCode = HTTP_STATUS.BAD_REQUEST, message = 'Error', errors = null) => {
  const response = {
    success: false,
    statusCode,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};