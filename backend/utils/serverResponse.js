export async function successResponse(res, message = "", data = null) {
  res.status(200).json({
    error: false,
    status: 200,
    message,
    data,
  });
}
export async function errorResponse(res, status, message = "") {
  res.status(200).json({
    error: true,
    status: 200,
    message,
    data:null,
  });
}
