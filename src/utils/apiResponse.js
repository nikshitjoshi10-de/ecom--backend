

export const apiResponse = (
  statusCode,
  data = null,
  message = "Success"
) => ({
  success: statusCode < 400,
  statusCode,
  message,
  data,
});


export const sendSuccess = (
  res,
  statusCode,
  data = null,
  message = "Success"
) => {
  return res.status(statusCode).json(
    apiResponse(statusCode, data, message)
  );
};